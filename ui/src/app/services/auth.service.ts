import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/users/login`;
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  pomeloLogin(userCredentials: any) {
    return this.httpClient.post(`${this.API_URL}`, userCredentials, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.warn('userToken', res.data.token);
          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('pomeloData', JSON.stringify(res.data.pomelo));
        },
        err => console.error(err)
      )
    );
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/admin.directory.resource.calendar');
    return from(this.afAuth.auth.signInWithPopup(provider))
      .pipe(tap(
        res => {
          this.setGoogleOauthInfo(res.credential['accessToken'], res.user['refreshToken'], res.user.email);
          return this.googleOauthInfo;
        },
        err => console.error(err)
      ));
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  get token() {
    return localStorage.getItem('userToken');
  }

  get pomeloData() {
    return JSON.parse(localStorage.getItem('pomeloData'));
  }

  setGoogleOauthInfo(authToken: string, refreshToken: string, email: string) {
    localStorage.setItem('googleOauthInfo', JSON.stringify({ authToken, refreshToken, email }));
  }

  get googleOauthInfo() {
    return JSON.parse(localStorage.getItem('googleOauthInfo'));
  }

  removeGoogleOauthInfo() {
    localStorage.removeItem('googleOauthInfo');
  }
}
