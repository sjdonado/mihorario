import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from '../../models/subject.model';

interface ScheduleOption {
  title: string;
  icon: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  @Input() fullName: string;
  @Input() schedule: Subject[][];
  @Output() periodSelector = new EventEmitter<any>();

  private hours: string[];
  private days: string[];
  private scheduleOptions: ScheduleOption[];

  constructor() { }

  ngOnInit() {
    this.days = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    this.scheduleOptions = [
      {
        title: 'Seleccionar periodo',
        icon: 'calendar_view_day'
      },
      {
        title: 'Conectar con Google',
        icon: 'calendar_today'
      },
      {
        title: 'Exportar',
        icon: 'share'
      }
    ];
    console.log(this.scheduleOptions);
  }

  scheduleOptionClick(option: number) {
    switch (option) {
      case 0:
        this.periodSelector.emit(null);
        break;
      default:
        break;
    }
  }
}
