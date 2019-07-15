import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../models/subject.model';
import { SubjectDetailsDialogComponent } from '../dialogs/subject-details-dialog/subject-details-dialog.component';

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

  constructor(
    public dialog: MatDialog
  ) { }

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
        title: 'Descargar',
        icon: 'arrow_downward'
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

  openSubjectDetailsDialog(subject: Subject): void {
    if (!subject) {
      return;
    }
    const dialogRef = this.dialog.open(SubjectDetailsDialogComponent, {
      width: `${window.innerWidth / 2.2 > 320 ? window.innerWidth / 2.2 : 300 }px`,
      // height: `${window.innerHeight / 1.6 }px`,
      data: subject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
    });
  }
}
