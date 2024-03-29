import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';

import { Subject } from '../../../models/subject.model';
import { GoogleCalendarService } from './google-calendar.service';
import {
  USER_TOKEN_COOKIE,
  SCHEDULE_BY_HOURS_KEY,
  SUBJECTS_BY_DAYS_KEY,
  GOOGLE_OAUTH_DATA_KEY,
} from 'src/app/constants';

interface GoogleOauthData {
  email: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = `${environment.apiUrl}/users`;
  private BASE_HEADER: HttpHeaders;

  constructor(
    private httpClient: HttpClient,
    private afAuth: AngularFireAuth,
    private googleCalendarService: GoogleCalendarService,
    private cookieService: CookieService,
  ) {
    this.BASE_HEADER = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: this.cookieService.get(USER_TOKEN_COOKIE),
    });
  }

  getSchedule(termId: string) {
    return this.httpClient.get(`${this.API_URL}/schedule?termId=${termId}`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          let currentStyle;
          let styleColorIdx = 0;
          const styles = new Map();
          this.setScheduleByHours(res.data.scheduleByHours.map((hours: Subject[]) => hours.map(subject => {
            if (!subject) {
              return subject;
            }
            if (styles.has(subject.nrc)) {
              currentStyle = styles.get(subject.nrc);
            } else {
              currentStyle = {
                color: this.googleCalendarService.eventColors[styleColorIdx + 1],
                notificationTime: 15,
              };
              styles.set(subject.nrc, currentStyle);
              styleColorIdx++;
            }
            return Object.assign(subject, currentStyle);
          })));

          this.setSubjectsByDays(res.data.subjectsByDays
            .map((day: Subject[]) => day.map(subject => Object.assign(subject, styles.get(subject.nrc)))));
        },
        err => console.error(err),
      )
    );
  }

  googleOauthLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    return from(this.afAuth.signInWithPopup(provider))
      .pipe(map(
        res => {
          console.log('googleOauthLogin', res);
          this.setGoogleOauthData({
            email: res.user.email,
            // tslint:disable-next-line: no-string-literal
            accessToken: res.credential['accessToken'],
            refreshToken: res.user.refreshToken,
          });
          return true;
          // return this.googleLogin(googleOauthTokens, res.user.email);
        },
        err => console.error(err)
      ));
  }

  get scheduleByHours() {
    return JSON.parse(localStorage.getItem(SCHEDULE_BY_HOURS_KEY));
  }

  setScheduleByHours(schedule: Subject[][]) {
    localStorage.setItem(SCHEDULE_BY_HOURS_KEY, JSON.stringify(schedule));
  }

  get subjectsByDays() {
    return JSON.parse(localStorage.getItem(SUBJECTS_BY_DAYS_KEY));
  }

  setSubjectsByDays(subjectsByDays: Subject[][]) {
    localStorage.setItem(SUBJECTS_BY_DAYS_KEY, JSON.stringify(subjectsByDays));
  }

  setGoogleOauthData(googleOauthData: GoogleOauthData) {
    this.cookieService.set(
      GOOGLE_OAUTH_DATA_KEY,
      JSON.stringify(googleOauthData),
      environment.cookies.expires,
      environment.cookies.path,
      environment.cookies.domain,
      environment.cookies.secure,
      'Strict',
    );
  }

  get googleOauthData() {
    return this.cookieService.check(GOOGLE_OAUTH_DATA_KEY) ? JSON.parse(this.cookieService.get(GOOGLE_OAUTH_DATA_KEY)) : null;
  }

  removeGoogleOauthData() {
    this.cookieService.delete(GOOGLE_OAUTH_DATA_KEY, environment.cookies.path, environment.cookies.domain);
  }
}
