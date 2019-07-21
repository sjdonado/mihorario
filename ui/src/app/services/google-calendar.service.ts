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
  private BASE_HEADER: HttpHeaders;
  private EVENT_COLORS = [
    { id: 0,
      background: '#ffffff',
      foreground: '#1d1d1d'
    },
    {
      id: 1,
      background: '#a4bdfc',
      foreground: '#1d1d1d'
    },
    {
      id: 2,
      background: '#7ae7bf',
      foreground: '#1d1d1d'
    },
    {
      id: 3,
      background: '#dbadff',
      foreground: '#1d1d1d'
    },
    {
      id: 4,
      background: '#ff887c',
      foreground: '#1d1d1d'
    },
    {
      id: 5,
      background: '#fbd75b',
      foreground: '#1d1d1d'
    },
    {
      id: 6,
      background: '#ffb878',
      foreground: '#1d1d1d'
    },
    {
      id: 7,
      background: '#46d6db',
      foreground: '#1d1d1d'
    },
    {
      id: 8,
      background: '#e1e1e1',
      foreground: '#1d1d1d'
    },
    {
      id: 9,
      background: '#5484ed',
      foreground: '#1d1d1d'
    },
    {
      id: 10,
      background: '#51b749',
      foreground: '#1d1d1d'
    },
    {
      id: 11,
      background: '#dc2127',
      foreground: '#1d1d1d'
    },
  ];

  constructor(
    private httpClient: HttpClient
  ) {
    this.BASE_HEADER = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: localStorage.getItem('userToken'),
    });
  }

  importSchedule(data: any) {
    return this.httpClient.post(`${this.API_URL}/import`, data, {
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

  get eventColors() {
    return this.EVENT_COLORS;
  }
}
