import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../../../models/subject.model';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { GoogleCalendarService } from './google-calendar.service';

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
  ) {
    // console.log('UserService -> userToken', localStorage.getItem('userToken'));
    this.BASE_HEADER = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: localStorage.getItem('userToken'),
    });
  }

  getSchedule(startDate: string) {
    console.log('startDate', startDate);
    return this.httpClient.get(`${this.API_URL}/schedule?startDate=${startDate}`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          const defaultSubjectStyle = {
            color: this.googleCalendarService.eventColors[0],
            notificationTime: 15,
          };
          this.setScheduleByHours(res.data.scheduleByHours.map((hours: Subject[]) => hours.map(subject => {
            if (!subject) {
              return subject;
            }
            return Object.assign(subject, defaultSubjectStyle);
          })));
          this.setSubjectsByDays(res.data.subjectsByDays
            .map((hours: Subject[]) => hours.map(subject => Object.assign(subject, defaultSubjectStyle))));
        },
        err => console.error(err),
      )
    );
  }

  // googleLogin(googleOauthTokens: GoogleOauthTokens, email: string) {
  //   return this.httpClient.post(`${this.API_URL}/login/google`, googleOauthTokens, {
  //     headers: this.BASE_HEADER,
  //   }).pipe(map(
  //     (res: any) => {
  //       console.warn('googleOauthEmail', email);
  //       this.setGoogleOauthEmail(email);
  //       return this.googleOauthEmail;
  //     },
  //     err => console.error(err)
  //   ));
  // }

  googleOauthLogin() {
    const provider = new auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    return from(this.afAuth.auth.signInWithPopup(provider))
      .pipe(map(
        res => {
          console.log('googleOauthLogin', res);
          this.setGoogleOauthData({
            email: res.user.email,
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
    return JSON.parse(localStorage.getItem('schedule'));
  }

  setScheduleByHours(schedule: Subject[][]) {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }

  get subjectsByDays() {
    return JSON.parse(localStorage.getItem('subjectsByDays'));
  }

  setSubjectsByDays(subjectsByDays: Subject[][]) {
    localStorage.setItem('subjectsByDays', JSON.stringify(subjectsByDays));
  }

  setGoogleOauthData(googleOauthData: GoogleOauthData) {
    localStorage.setItem('googleOauthData', JSON.stringify(googleOauthData));
  }

  get googleOauthData() {
    return JSON.parse(localStorage.getItem('googleOauthData'));
  }

  removeGoogleOauthData() {
    localStorage.removeItem('googleOauthData');
  }
}
