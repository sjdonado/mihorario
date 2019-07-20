import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../models/subject.model';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';

interface GoogleOauthInfo {
  accessToken: string;
  refreshToken: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = `${environment.apiUrl}/users`;
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json',
    authorization: localStorage.getItem('userToken'),
  });

  constructor(
    private httpClient: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  getSchedule(scheduleOption: string) {
    return this.httpClient.get(`${this.API_URL}/schedule?scheduleOption=${scheduleOption}`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          const defaultSubjectStyle = {
            color: '#FFFFFF',
            textColor: 'black',
            notificationTime: 10,
          };
          console.log('getSchedule', res);
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

  googleLogin(googleOauthInfo: GoogleOauthInfo) {
    return this.httpClient.post(`${this.API_URL}/login/google`, googleOauthInfo, {
      headers: this.BASE_HEADER,
    }).pipe(map(
      (res: any) => {
        console.warn('googleOauthInfo', googleOauthInfo);
        this.setGoogleOauthInfo(googleOauthInfo);
        return this.googleOauthInfo;
      },
      err => console.error(err)
    ));
  }

  googleOauthLogin() {
    const provider = new auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/calendar');
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    return from(this.afAuth.auth.signInWithPopup(provider))
      .pipe(map(
        res => {
          console.log('googleOauthLogin', res);
          const googleOauthInfo = {
            accessToken: res.credential['accessToken'],
            refreshToken: res.user.refreshToken,
            email: res.user.email
          };
          return this.googleLogin(googleOauthInfo);
        },
        err => console.error(err)
      ));
  }

  logout() {
    return this.httpClient.post(`${this.API_URL}/logout`, null, {
      headers: this.BASE_HEADER,
    })
      .subscribe(res => {
        localStorage.clear();
        this.router.navigate(['/login']);
      });
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

  setGoogleOauthInfo(googleOauthInfo: GoogleOauthInfo) {
    localStorage.setItem('googleOauthInfo', JSON.stringify(googleOauthInfo));
  }

  get googleOauthInfo() {
    return JSON.parse(localStorage.getItem('googleOauthInfo'));
  }

  removeGoogleOauthInfo() {
    localStorage.removeItem('googleOauthInfo');
  }
}
