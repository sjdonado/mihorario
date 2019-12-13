import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_TOKEN_COOKIE, POMELO_DATA_COOKIE } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/users`;
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { }

  pomeloLogin(userCredentials: any) {
    return this.httpClient.post(`${this.API_URL}/login`, userCredentials, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          // console.warn('userToken', res.data.token);
          this.cookieService.set(
            USER_TOKEN_COOKIE,
            res.data.token,
            environment.cookies.expires,
            environment.cookies.path,
            environment.cookies.domain,
            environment.cookies.secure,
            'Strict',
          );
          this.cookieService.set(
            POMELO_DATA_COOKIE,
            JSON.stringify(res.data.pomelo),
            environment.cookies.expires,
            environment.cookies.path,
            environment.cookies.domain,
            environment.cookies.secure,
            'Strict',
          );
          console.log('userToken', this.cookieService.get(USER_TOKEN_COOKIE));
          console.log('pomeloData', JSON.parse(this.cookieService.get(POMELO_DATA_COOKIE)));
        },
        err => console.error(err)
      )
    );
  }

  get token() {
    return this.cookieService.get(USER_TOKEN_COOKIE);
  }

  get pomeloData() {
    return JSON.parse(this.cookieService.get(POMELO_DATA_COOKIE));
  }
}
