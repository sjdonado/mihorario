import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  GENERAL_ERROR_MESSAGE = 'Ocurrió un error';

  constructor(
    private snackBar: MatSnackBar
  ) { }

  show(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', { duration });
  }
}
