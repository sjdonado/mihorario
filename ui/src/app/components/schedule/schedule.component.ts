import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  @Input() fullName: string;
  @Input() schedule: Subject[][];
  private hours: string[];
  private days: string[];

  constructor() { }

  ngOnInit() {
    this.days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  }
}
