import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'src/app/models/subject.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { GoogleCalendarService } from 'src/app/services/google-calendar.service';
import { MatDialog } from '@angular/material/dialog';
import { SubjectDetailsDialogComponent } from 'src/app/components/dialogs/subject-details-dialog/subject-details-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-subjects-selector',
  templateUrl: './subjects-selector.component.html',
  styleUrls: ['./subjects-selector.component.scss']
})
export class SubjectsSelectorComponent implements OnInit, OnDestroy {

  private subjects: Subject[];
  private form: FormGroup;
  private selectAll = false;
  private isLoading: boolean;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private googleCalendarService: GoogleCalendarService,
    private notificationService: NotificationService,
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

  ngOnDestroy() {
    this.notificationService.stopAll();
  }

  sendSubjects() {
    this.isLoading = true;
    const selectedSubjects = this.form.value.selectedSubjects.filter(subject => subject.checked);
    console.log('selectedSubjects', selectedSubjects);
    this.googleCalendarService.importSchedule({ selectedSubjects })
      .subscribe(
        (response: any) => {
          console.log(response);
          response.data.forEach(subjectResponse => {
            console.log('subjectResponse', subjectResponse);
            const subject = this.subjects.find(elem => elem.nrc === subjectResponse.data.subject.nrc);
            let message: string;
            if (subjectResponse.status && subjectResponse.status === 200) {
              subject.googleSync = true;
              message = `${subjectResponse.data.subject.shortName} importada correctamente.`;
            } else {
              subject.googleSync = false;
              message = `Error importando ${subjectResponse.data.subject.shortName}.`;
            }
            if (!this.notificationService.isInQueue(message)) {
              this.notificationService.add(message);
            }
          });
          this.updateSubjectByDays();
          this.selectAll = false;
          this.form.reset();
          this.isLoading = false;
        }, (err) => {
          this.isLoading = false;
          this.notificationService.add(`Error importando las materias seleccionadas, intenta de nuevo.`);
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

  updateSubjectByDays() {
    const updatedSubjectsByDays = this.userService.subjectsByDays.map((day: Subject[]) => day.map((subject: Subject) => {
      const selectedSubject = this.subjects.find(elem => elem.nrc === subject.nrc);
      return Object.assign(subject, selectedSubject);
    }));
    this.userService.setSubjectsByDays(updatedSubjectsByDays);
  }

  get getFormGroup() {
    return this.form;
  }
}
