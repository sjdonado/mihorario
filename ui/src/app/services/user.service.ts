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
}
