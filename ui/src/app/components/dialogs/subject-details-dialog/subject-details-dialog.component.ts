import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'src/app/models/subject.model';
import * as moment from 'moment';

@Component({
  selector: 'app-subject-details-dialog',
  templateUrl: './subject-details-dialog.component.html',
  styleUrls: ['./subject-details-dialog.component.scss']
})
export class SubjectDetailsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SubjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Subject
  ) {
    this.data = Object.assign(data, {
      startParsed: moment(data.start, 'HH:mm').format('hh:mm A'),
      finishParsed: moment(data.finish, 'HH:mm').format('hh:mm A')
    });
  }

}
