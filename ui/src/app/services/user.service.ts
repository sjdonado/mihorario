import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:3000/api/v1/users';
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json',
    authorization: localStorage.getItem('userToken'),
  });

  constructor(
    private httpClient: HttpClient
  ) { }

  getPomeloScheduleOptions() {
    const scheduleOptions = this.scheduleOptions();
    if (scheduleOptions) {
      console.warn('CACHED => scheduleOptions', scheduleOptions);
      return new Observable(observer => {
        observer.next(scheduleOptions);
        observer.complete();
      });
    }
    return this.httpClient.get(`${this.API_URL}/schedule/options`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.log('getPomeloScheduleOptions', res.data);
          localStorage.setItem('scheduleOptions', JSON.stringify(res));
        },
        err => console.error(err),
      )
    );
  }

  scheduleOptions() {
    return JSON.parse(localStorage.getItem('scheduleOptions'));
  }

}
