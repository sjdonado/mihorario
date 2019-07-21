import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/users`;
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private userToken: string;

  constructor(
    private httpClient: HttpClient,
  ) { }

  pomeloLogin(userCredentials: any) {
    return this.httpClient.post(`${this.API_URL}/login`, userCredentials, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.warn('userToken', res.data.token);
          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('pomeloData', JSON.stringify(res.data.pomelo));
          this.userToken = res.data.token;
        },
        err => console.error(err)
      )
    );
  }

  get token() {
    return localStorage.getItem('userToken') || this.userToken;
  }

  get pomeloData() {
    return JSON.parse(localStorage.getItem('pomeloData'));
  }
}
