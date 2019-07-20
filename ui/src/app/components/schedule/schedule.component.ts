import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Color from 'color';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../models/subject.model';
import { SubjectDetailsDialogComponent } from '../dialogs/subject-details-dialog/subject-details-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import html2canvas from 'html2canvas';

interface ScheduleOption {
  title: string;
  icon: string;
  link?: string;
  click?: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  private hours: string[];
  private days: string[];
  private linksOptions: ScheduleOption[];
  private clicksOptions: ScheduleOption[];
  private fullName: string;
  private schedule: Subject[][];
  private subjectsByDays: Subject[][];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.schedule = this.userService.scheduleByHours;
    this.subjectsByDays = this.userService.subjectsByDays;
    this.fullName = this.authService.pomeloData.fullName;
    this.days = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    this.linksOptions = [
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
    ];
    this.clicksOptions = [
      {
        title: 'Descargar',
        icon: 'arrow_downward',
        click: 'downloadSchedule'
      }
    ];
    console.log('schedule', this.schedule);
    console.log('subjectsByDays', this.subjectsByDays);
  }

  openSubjectDetailsDialog(subject: Subject): void {
    if (!subject) {
      return;
    }
    const dialogRef = this.dialog.open(SubjectDetailsDialogComponent, {
      width: `${window.innerWidth / 2.2 > 320 ? window.innerWidth / 2.2 : 300 }px`,
      data: { editor: true, subject: Object.assign(subject, this.getSubjectStyle(subject)) }
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

  downloadSchedule() {
    console.log('downloadSchedule');
    html2canvas(document.querySelector('#scheduleDiv')).then(canvas => {
      canvas.toBlob((blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'mihorarioUN';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }), 'image/jpeg');
    });
  }
}
