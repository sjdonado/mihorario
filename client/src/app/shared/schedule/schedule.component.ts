import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../models/subject.model';
import { SubjectDetailsDialogComponent } from '../dialogs/subject-details-dialog/subject-details-dialog.component';
import { UserService } from 'src/app/components/home/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import html2canvas from 'html2canvas';
import { EventColor } from 'src/app/models/event-color.model';

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
  public linksOptions: ScheduleOption[];
  public clicksOptions: ScheduleOption[];
  private fullName: string;
  private schedule: Subject[][];
  private subjectsByDays: Subject[][];
  private isLocationView: boolean;

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
    this.isLocationView = false;
    this.linksOptions = [
      {
        title: 'Seleccionar periodo',
        icon: 'calendar_view_day',
        link: '/home/period'
      },
      {
        title: 'Exportar',
        icon: 'import_export',
        link: '/home/export'
      },
    ];
    this.clicksOptions = [
      {
        title: 'Descargar',
        icon: 'arrow_downward',
        click: 'downloadSchedule'
      },
    ];
    // console.log('schedule', this.schedule);
    // console.log('subjectsByDays', this.subjectsByDays);
  }

  openSubjectDetailsDialog(subject: Subject): void {
    if (!subject) {
      return;
    }
    console.log('openSubjectDetailsDialog', subject);
    const dialogRef = this.dialog.open(SubjectDetailsDialogComponent, {
      width: `${window.innerWidth / 2.2 > 320 ? window.innerWidth / 2.2 : 300 }px`,
      data: { editor: true, subject: Object.assign(subject, this.getSubjectStyle(subject)) }
    });

    dialogRef.afterClosed().subscribe(subjectDetailsData => {
      if (subjectDetailsData) {
        const { color, notificationTime } = subjectDetailsData;
        console.log('=> DIALOG CLOSED', color, notificationTime);
        this.setSubjectByDaysProperties(subject, color, notificationTime);
        this.userService.setSubjectsByDays(this.subjectsByDays);
        console.log('subjectsByDays', this.subjectsByDays);
      }
    });
  }

  getSubjectByDays(subject: Subject) {
    return this.subjectsByDays.map((day: Subject[]) => day.find((elem: Subject) => elem.nrc === subject.nrc)).filter(elem => elem);
  }

  setSubjectByDaysProperties(subject: Subject, color: EventColor, notificationTime: number) {
    this.getSubjectByDays(subject).forEach(subjectByDay => {
      if (subjectByDay.color !== color || subjectByDay.notificationTime !== notificationTime) {
        subjectByDay.googleSynced = false;
      }
      subjectByDay.color = color;
      subjectByDay.notificationTime = notificationTime;
    });
  }

  getSubjectStyle(subject: Subject) {
    if (!subject) {
      return { color: { foreground: '#1d1d1d' } };
    }
    const { color, notificationTime } = this.getSubjectByDays(subject)[0];
    return { color, notificationTime };
  }


  downloadSchedule() {
    const oldViewPortContent = document.querySelector('meta[name=viewport]').getAttribute('content');
    const viewport = document.querySelector('meta[name=viewport]');
    viewport.setAttribute('content', 'width=1024');
    html2canvas(document.querySelector('#scheduleDiv'), {
      height: 616,
    }).then(canvas => {
      canvas.toBlob((blob => {
        saveAs(blob, `mi_horario_un_${new Date().toLocaleDateString()}`);
        viewport.setAttribute('content', oldViewPortContent);
      }), 'image/jpeg');
    });
  }

  toggleView() {
    this.isLocationView = !this.isLocationView;
  }
}
