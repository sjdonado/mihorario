import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../models/subject.model';
import { SubjectDetailsDialogComponent } from '../dialogs/subject-details-dialog/subject-details-dialog.component';
import * as Color from 'color';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

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
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService
  ) {}

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
      case 1:
        this.authService.googleLogin();
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
      data: subject
    });

    dialogRef.afterClosed().subscribe(subjectDetailsData => {
      console.log('result', subjectDetailsData);
      if (subjectDetailsData && subjectDetailsData.color) {
        const textColor = Color(subjectDetailsData.color).isLight() ? 'black' : 'white';
        this.schedule.forEach(hour => {
          hour.forEach(child => {
            if (child && subject && child.nrc === subject.nrc) {
              child.color = subjectDetailsData.color;
              child.textColor = textColor;
            }
          });
        });
        this.userService.setSchedule(this.schedule);
      }
    });
  }
}
