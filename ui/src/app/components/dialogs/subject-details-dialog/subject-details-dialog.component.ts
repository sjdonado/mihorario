import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'src/app/models/subject.model';
import { SubjectDetailsData } from 'src/app/models/subject-details-data.model';
import { GoogleCalendarService } from 'src/app/services/google-calendar.service';
import { EventColor } from 'src/app/models/event-color.model';

export interface EventNotificationTime {
  text: string;
  value: number;
}

@Component({
  selector: 'app-subject-details-dialog',
  templateUrl: './subject-details-dialog.component.html',
  styleUrls: ['./subject-details-dialog.component.scss']
})
export class SubjectDetailsDialogComponent {

  private eventColors: string[];
  private notificationTimeOptions: EventNotificationTime[];
  public subject: Subject;
  private subjectEventColor: EventColor;
  private subjectNotificationTime: number;
  public isVisibleColorPicker = false;

  constructor(
    private googleCalendarService: GoogleCalendarService,
    public dialogRef: MatDialogRef<SubjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventColors = this.googleCalendarService.eventColors.map(eventColor => eventColor.background);
    this.notificationTimeOptions = [];
    for (let i = 5; i <= 60; i += 5) {
      this.notificationTimeOptions.push({
        text: `${i} minutos antes`,
        value: i,
      });
    }
    this.subject = this.data.subject;
    this.subjectEventColor = this.data.subject.color;
    this.subjectNotificationTime = this.data.subject.notificationTime;
    console.log('subject', this.data.subject, 'subjectEventColor', this.subjectEventColor);
  }

  colorPicker(event: any) {
    console.log('color', event.color.hex, 'event', event);
    if (event.$event.key && event.$event.key !== 'Enter') {
      return;
    }
    this.subjectEventColor = this.googleCalendarService.eventColors.find(eventColor => eventColor.background === event.color.hex);
    this.toggleColorPicker();
  }

  toggleColorPicker() {
    this.isVisibleColorPicker = !this.isVisibleColorPicker;
  }

  get subjectDetailsData(): SubjectDetailsData {
    return {
      color: this.subjectEventColor,
      notificationTime: this.subjectNotificationTime,
    };
  }
}
