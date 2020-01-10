import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/home/services/user.service';
import { Subject } from 'src/app/models/subject.model';
import { GoogleCalendarService } from 'src/app/components/home/services/google-calendar.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-calendar-options',
  templateUrl: './calendar-options.component.html',
  styleUrls: ['./calendar-options.component.scss']
})
export class CalendarOptionsComponent implements OnInit {

  public googleOauthData: any;
  private subjectsByDays: Subject[][];
  private subjects: Subject[];

  constructor(
    private userService: UserService,
    private googleCalendarService: GoogleCalendarService,
    private notificationService: NotificationService,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.googleOauthData = this.userService.googleOauthData;
    this.subjectsByDays = this.userService.subjectsByDays;
    this.subjects = this.googleCalendarService.getSubjects(this.subjectsByDays);
  }

  googleOauth() {
    if (this.userService.googleOauthData) {
      this.router.navigateByUrl('/home/export/select');
      return;
    }
    this.userService.googleOauthLogin()
      .subscribe((oauthRes) => {
        if (oauthRes) {
          this.googleCalendarService.syncSchedule(this.subjects)
            .subscribe(
              (res: any) => {
                const { data } = res;
                this.subjectsByDays.forEach((day: Subject[]) => day.forEach((subject: Subject) => {
                  const subjectRes = data.find(elem => elem.nrc === subject.nrc);
                  subject.googleSynced = subjectRes.googleSynced;
                  const color = this.googleCalendarService.eventColors
                    .find(eventColor => eventColor.id === parseInt(subjectRes.color, 10));
                  subject.color = color ? color : subject.color;
                  subject.notificationTime = subjectRes.notificationTime;
                }));
                this.userService.setSubjectsByDays(this.subjectsByDays);
                this.ngZone.run(() => {
                  this.router.navigateByUrl('/home/export/select');
                });
              },
              (err: any) => {
                this.notificationService.add('Error sincronizando tus materias.');
                console.log('Error', err);
              }
          );
        }
      });
  }

  signInWithAnotherAccount() {
    this.userService.removeGoogleOauthData();
    this.googleOauth();
  }

}
