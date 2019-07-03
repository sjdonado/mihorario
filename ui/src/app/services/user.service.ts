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

  getPomeloSchedulePeriods() {
    const schedulePeriods = this.schedulePeriods();
    if (schedulePeriods) {
      console.warn('CACHED => schedulePeriods', schedulePeriods);
      return new Observable(observer => {
        observer.next(schedulePeriods);
        observer.complete();
      });
    }
    return this.httpClient.get(`${this.API_URL}/schedule/options`, {
      headers: this.BASE_HEADER,
    }).pipe(
      tap(
        (res: any) => {
          console.log('getPomeloSchedulePeriods', res.data);
          localStorage.setItem('schedulePeriods', JSON.stringify(res));
        },
        err => console.error(err),
      )
    );
  }

  schedulePeriods() {
    return JSON.parse(localStorage.getItem('schedulePeriods'));
  }

}
