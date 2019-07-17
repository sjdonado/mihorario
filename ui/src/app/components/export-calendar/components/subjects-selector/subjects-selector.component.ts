import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'src/app/models/subject.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { GoogleCalendarService } from 'src/app/services/google-calendar.service';
import { MatDialog } from '@angular/material/dialog';
import { SubjectDetailsDialogComponent } from 'src/app/components/dialogs/subject-details-dialog/subject-details-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subjects-selector',
  templateUrl: './subjects-selector.component.html',
  styleUrls: ['./subjects-selector.component.scss']
})
export class SubjectsSelectorComponent implements OnInit {

  private subjects: Subject[];
  private form: FormGroup;
  private selectAll = false;
  private isLoading: boolean;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private googleCalendarService: GoogleCalendarService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.subjects = [];
    this.form = this.formBuilder.group({
      selectedSubjects: this.formBuilder.array([]),
    });
    this.userService.subjectsByDays.forEach((day: Subject[]) => day.forEach((subject: Subject) => {
      if (!this.subjects.find(elem => elem.nrc === subject.nrc)) {
        this.subjects.push(subject);
        (this.form.controls.selectedSubjects as FormArray).push(this.formBuilder.group({
          nrc: this.formBuilder.control(subject.nrc),
          color: this.formBuilder.control(subject.color),
          notificationTime: this.formBuilder.control(subject.notificationTime),
          checked: this.formBuilder.control(false)
        }));
      }
    }));

    console.log('subjects', this.subjects);
  }

  sendSubjects() {
    this.isLoading = true;
    const selectedSubjects = this.form.value.selectedSubjects.filter(subject => subject.checked);
    console.log('selectedSubjects', selectedSubjects);
    this.googleCalendarService.importSchedule({ selectedSubjects })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.isLoading = false;
        }, (err) => {
          this.isLoading = false;
          // this.snackBar.open('Error al obtener tu horario, intente de nuevo', 'Cerrar', { duration: 3000 });
          console.log('Error: ' + err);
        }
      );
  }

  openSubjectDetailsDialog(subject: Subject) {
    this.dialog.open(SubjectDetailsDialogComponent, {
      width: `${window.innerWidth / 2.2 > 320 ? window.innerWidth / 2.2 : 300 }px`,
      data: { editor: false, subject }
    });
  }

  onSelectAllChange() {
    (this.form.controls.selectedSubjects as FormArray).controls
      .forEach(control => control.setValue(Object.assign(control.value, { checked: this.selectAll })));
  }

  get getFormGroup() {
    return this.form;
  }

}
