import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from '../models/subject.model';


@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  private API_URL = `${environment.apiUrl}/google-calendar`;
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json',
    authorization: localStorage.getItem('userToken'),
  });

  constructor(
    private httpClient: HttpClient
  ) { }

  importSchedule(subjectsByDays: Subject[][]) {
    return this.httpClient.post(`${this.API_URL}/import`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.log('importSchedule', res);
        },
        err => console.error(err),
      )
    );
  }
}
