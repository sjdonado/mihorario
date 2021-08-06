import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private API_URL = `${environment.apiUrl}/statistics`;
  private BASE_HEADER = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private httpClient: HttpClient,
  ) { }

  getStatistics() {
    return this.httpClient.get(`${this.API_URL}/users`, {
      headers: this.BASE_HEADER
    })
  }
}
