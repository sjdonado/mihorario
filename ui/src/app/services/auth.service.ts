import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { environment } from 'src/environments/environment';

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
        err => console.error(err),
      )
    );
  }

  googleLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((res) => {
        this.setGoogleOauthTokens(res.credential['accessToken'], res.user['refreshToken']);
        return this.googleOauthTokens;
      })
      .catch(err => console.log(err));
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

  setGoogleOauthTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('googleOauthTokens', JSON.stringify({ accessToken, refreshToken }));
  }

  get googleOauthTokens() {
    return JSON.parse(localStorage.getItem('googleOauthTokens'));
  }
}
