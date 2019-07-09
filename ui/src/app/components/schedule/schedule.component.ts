import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from '../../models/subject.model';

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

  constructor() { }

  ngOnInit() {
    this.days = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  }

  periodSelectorEvent() {
    this.periodSelector.emit(null);
  }
}
