import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/api/v1/users/login';
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  pomeloLogin(userCredentials: any) {
    return this.httpClient.post(`${this.API_URL}`, userCredentials, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.warn('userToken', res.data.token);
          localStorage.setItem('userToken', res.data.token);
        },
        err => console.error(err),
      )
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  get token() {
    return localStorage.getItem('userToken');
  }
}
