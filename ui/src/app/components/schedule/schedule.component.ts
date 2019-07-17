import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Color from 'color';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../models/subject.model';
import { SubjectDetailsDialogComponent } from '../dialogs/subject-details-dialog/subject-details-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

interface ScheduleOption {
  title: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  private hours: string[];
  private days: string[];
  private scheduleOptions: ScheduleOption[];
  private fullName: string;
  private schedule: Subject[][];
  private subjectsByDays: Subject[][];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.days = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    this.scheduleOptions = [
      {
        title: 'Seleccionar periodo',
        icon: 'calendar_view_day',
        link: '/period'
      },
      {
        title: 'Exportar',
        icon: 'import_export',
        link: '/export'
      },
      {
        title: 'Descargar',
        icon: 'arrow_downward',
        link: '/'
      }
    ];
    console.log(this.scheduleOptions);
    this.schedule = this.userService.scheduleByHours;
    console.log('schedule', this.schedule);
    this.subjectsByDays = this.userService.subjectsByDays;
    console.log('subjectsByDays', this.subjectsByDays);
    this.fullName = this.authService.pomeloData.fullName;
  }

  openSubjectDetailsDialog(subject: Subject): void {
    if (!subject) {
      return;
    }
    const dialogRef = this.dialog.open(SubjectDetailsDialogComponent, {
      width: `${window.innerWidth / 2.2 > 320 ? window.innerWidth / 2.2 : 300 }px`,
      data: { editor: true, subject }
    });

    dialogRef.afterClosed().subscribe(subjectDetailsData => {
      console.log('result', subjectDetailsData);
      const { color, notificationTime } = subjectDetailsData;
      if (color && notificationTime ) {
        const textColor = Color(color).isLight() ? 'black' : 'white';
        this.setSubjectByDaysProperties(subject, color, textColor, notificationTime);
        this.userService.setSubjectsByDays(this.subjectsByDays);
      }
    });
  }

  getSubjectByDays(subject: Subject) {
    return this.subjectsByDays.map(days => days.find(elem => elem.nrc === subject.nrc)).filter(elem => elem);
  }

  setSubjectByDaysProperties(subject: Subject, color: string, textColor: string, notificationTime: number) {
    this.getSubjectByDays(subject).forEach(subjectByDay => {
      subjectByDay.color = color;
      subjectByDay.textColor = textColor;
      subjectByDay.notificationTime = notificationTime;
    });
  }

  getSubjectStyle(subject: Subject) {
    if (!subject) {
      return { color: '#FFFFFF', textColor: 'black' };
    }
    const { color, textColor } = this.getSubjectByDays(subject)[0];
    return { color, textColor };
  }
}
