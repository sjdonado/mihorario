import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from '../../../models/subject.model';
import {
  USER_TOKEN_COOKIE,
  GOOGLE_OAUTH_DATA_KEY,
} from 'src/app/constants';

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
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) {
    this.BASE_HEADER = new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: this.cookieService.get(USER_TOKEN_COOKIE),
    });
  }

  importSchedule(data: any) {
    const googleOauthData = JSON.parse(this.cookieService.get(GOOGLE_OAUTH_DATA_KEY));
    return this.httpClient.post(`${this.API_URL}/import`, Object.assign(data, googleOauthData), {
      headers: this.BASE_HEADER,
    });
  }

  syncSchedule(data: any) {
    const googleOauthData = JSON.parse(this.cookieService.get(GOOGLE_OAUTH_DATA_KEY));
    return this.httpClient.post(`${this.API_URL}/sync`, Object.assign(data, googleOauthData), {
      headers: this.BASE_HEADER,
    });
  }

  getSubjects(subjectsByDays: Subject[][]) {
    const subjects = [];
    subjectsByDays.forEach((day: Subject[]) => day.forEach((subject: Subject) => {
      if (!subjects.find(elem => elem.nrc === subject.nrc)) {
        subjects.push(subject);
      }
    }));
    return subjects;
  }

  get eventColors() {
    return this.EVENT_COLORS;
  }
}
