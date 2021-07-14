import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../models/subject.model';
import { SubjectDetailsDialogComponent } from '../dialogs/subject-details-dialog/subject-details-dialog.component';
import { UserService } from 'src/app/components/home/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import html2canvas from 'html2canvas';
import { EventColor } from 'src/app/models/event-color.model';
import { NotificationService } from 'src/app/services/notification.service';

interface ScheduleOption {
  title: string;
  icon: string;
  link?: string;
  click?: () => void;
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
  public isLocationView: boolean;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
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
        click: this.downloadSchedule.bind(this)
      },
    ];
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


  async downloadSchedule() {
    try {
      const oldViewPortContent = document.querySelector('meta[name=viewport]').getAttribute('content');
      const viewport = document.querySelector('meta[name=viewport]');
      const windowWidth = 1440;
      viewport.setAttribute('content', `width=${windowWidth}`);
      const scheduleDiv = document.getElementById('scheduleDiv');

      const canvas = await html2canvas(scheduleDiv, { height: 615, width: 1340, scrollX: 10, scrollY: 40, windowWidth })

      viewport.setAttribute('content', oldViewPortContent);

      const link = document.createElement('a');
      link.download = `mihorarioun_${new Date().toLocaleDateString()}`;
      link.href = canvas.toDataURL();
      link.click();

      this.notificationService.add('Horario descargado correctamente');
    } catch(err) {
      this.notificationService.add('Ocurrio un error, intenta de nuevo');
    }
  }

  toggleView() {
    this.isLocationView = !this.isLocationView;
  }
}
