import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.httpClient.get(`${this.API_URL}/schedule?scheduleOption=${scheduleOption}`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.log('getSchedule', res);
          this.setSchedule(res.data.schedule);
          this.setSubjectsByDays(res.data.subjectsByDays);
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

  get subjectsByDays() {
    return JSON.parse(localStorage.getItem('subjectsByDays'));
  }

  setSubjectsByDays(subjectsByDays: Subject[][]) {
    localStorage.setItem('subjectsByDays', JSON.stringify(subjectsByDays));
  }
}
