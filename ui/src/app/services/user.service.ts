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

  getSchedule(scheduleOption: string) {
    const schedule = this.schedule;
    if (schedule) {
      console.warn('CACHED => schedule', schedule);
      return new Observable(observer => {
        observer.next(schedule);
        observer.complete();
      });
    }
    return this.httpClient.get(`${this.API_URL}/schedule?scheduleOption=${scheduleOption}`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.log('getSchedule', res);
          localStorage.setItem('schedule', JSON.stringify(res));
        },
        err => console.error(err),
      )
    );
  }

  get schedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }

}
