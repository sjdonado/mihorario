import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-export-calendar',
  templateUrl: './export-calendar.component.html',
  styleUrls: ['./export-calendar.component.scss']
})
export class ExportCalendarComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {

  }
}
