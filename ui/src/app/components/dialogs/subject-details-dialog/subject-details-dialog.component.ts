import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'src/app/models/subject.model';
import { SubjectDetailsData } from 'src/app/models/subject-details-data.model';
import * as moment from 'moment';

@Component({
  selector: 'app-subject-details-dialog',
  templateUrl: './subject-details-dialog.component.html',
  styleUrls: ['./subject-details-dialog.component.scss']
})
export class SubjectDetailsDialogComponent {

  private subject: Subject;
  private subjectColor: string;
  private colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
    '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
    '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#FFFFFF'
  ];
  private isVisibleColorTwitter = false;

  constructor(
    public dialogRef: MatDialogRef<SubjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.subject = Object.assign(this.data.subject, {
      startParsed: moment(data.start, 'HH:mm').format('hh:mm A'),
      finishParsed: moment(data.finish, 'HH:mm').format('hh:mm A')
    });
    this.subjectColor = this.subject.color;
  }

  colorPicker(event: any) {
    console.log('color', event.color.hex, 'event', event);
    if (event.$event.key && event.$event.key !== 'Enter') {
      return;
    }
    this.subjectColor = event.color.hex;
    this.isVisibleColorTwitter = !this.isVisibleColorTwitter;
  }

  toggleColorTwitter() {
    this.isVisibleColorTwitter = !this.isVisibleColorTwitter;
  }

  get subjectDetailsData(): SubjectDetailsData {
    return {
      color: this.subjectColor,
      notificationTime: 10,
    };
  }
}
