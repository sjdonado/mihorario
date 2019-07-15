import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Subject } from '../models/subject.model';
import { environment } from 'src/environments/environment';

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
          this.setSchedule(res.data.schedule);
        },
        err => console.error(err),
      )
    );
  }

  get schedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }

  setSchedule(schedule: Subject[][]) {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }
}
