import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(tap(
        () => { },
        err => {
          if (req.headers.has('Authorization') && err.status === 401) {
            this.invalidAuthLocalData();
          } else {
            console.log('I', err);
            const message = err.error.error && err.error.error.message ?
              err.error.error.message : this.notificationService.GENERAL_ERROR_MESSAGE;
            this.notificationService.add(message);
          }
        }
      )
    );
  }

  private invalidAuthLocalData() {
    this.notificationService.add('Tiempo límite de sesión web ha expirado, ingrese nuevamente.');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
