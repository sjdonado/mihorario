import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'src/app/models/subject.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserService } from 'src/app/components/home/services/user.service';
import { GoogleCalendarService } from 'src/app/components/home/services/google-calendar.service';
import { MatDialog } from '@angular/material/dialog';
import { SubjectDetailsDialogComponent } from 'src/app/shared/dialogs/subject-details-dialog/subject-details-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-subjects-selector',
  templateUrl: './subjects-selector.component.html',
  styleUrls: ['./subjects-selector.component.scss']
})
export class SubjectsSelectorComponent implements OnInit, OnDestroy {

  private subjects: Subject[];
  private subjectsByDays: Subject[][];
  private form: FormGroup;
  private selectAll = false;
  public isLoading: boolean;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private googleCalendarService: GoogleCalendarService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.subjectsByDays = this.userService.subjectsByDays;
    this.subjects = this.googleCalendarService.getSubjects(this.subjectsByDays);
    // console.log('subjects', this.subjects);

    this.form = this.formBuilder.group({
      selectedSubjects: this.formBuilder.array([]),
    });

    this.subjects.forEach((subject: Subject) => {
      (this.form.controls.selectedSubjects as FormArray).push(this.formBuilder.group({
        nrc: this.formBuilder.control(subject.nrc),
        color: this.formBuilder.control(subject.color),
        notificationTime: this.formBuilder.control(subject.notificationTime),
        checked: this.formBuilder.control(false),
      }));
    });
  }

  ngOnDestroy() {
    this.notificationService.stopAll();
  }

  sendSubjects() {
    const selectedSubjects = this.form.value.selectedSubjects.filter(subject => subject.checked);
    if (!selectedSubjects.length) {
      return;
    }
    this.isLoading = true;
    const subjects = this.subjectsByDays.map(day => day.map((subject) => {
      const selectedSubject = selectedSubjects.find(elem => elem.nrc === subject.nrc);
      if (selectedSubject) {
        const { color, notificationTime } = selectedSubject;
        return Object.assign(subject, { colorId: color.id, notificationTime });
      }
    }).filter(elem => elem));
    console.log('subjectsByDays', this.subjectsByDays);
    console.log('selectedSubjects', selectedSubjects);
    console.log('finalSubjects', subjects);

    this.googleCalendarService.importSubjects(subjects)
      .subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
          let sucessImportsCount = 0;
          const importedSubjects = [];
          data.forEach(subjectResponse => {
            console.log('subjectResponse', subjectResponse);
            const subject = this.subjects.find(elem => elem.nrc === subjectResponse.data.subject.nrc);
            const imported = importedSubjects.indexOf(subject.nrc) !== -1;
            if (!imported) {
              importedSubjects.push(subject.nrc);
            }
            if (subjectResponse.status && subjectResponse.status === 200) {
              subject.googleSynced = true;
              if (!imported) {
                sucessImportsCount += 1;
              }
            } else {
              subject.googleSynced = false;
              const message = `Error importando ${subjectResponse.data.subject.shortName}.`;
              if (!this.notificationService.isInQueue(message)) {
                this.notificationService.add(message);
              }
            }
          });
          this.notificationService.add(`Materias importadas: ${sucessImportsCount}/${importedSubjects.length}`);
          this.updateSubjectByDays();
          this.form.reset();
          this.selectAll = false;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.notificationService.add('Error importando las materias seleccionadas, intenta de nuevo.');
          console.log('Error', err);
        }
      );
  }

  removeSubjects() {
    const selectedSubjects = this.form.value.selectedSubjects.filter(subject => subject.checked);
    if (!selectedSubjects.length) {
      return;
    }
    this.isLoading = true;
    const subjects = [];
    this.subjectsByDays.forEach(day => day.forEach((subject) => {
      if (selectedSubjects.some(elem => elem.nrc === subject.nrc)) {
        subjects.push(subject);
      }
    }));
    // console.log('subjectsByDays', this.subjectsByDays);
    // console.log('selectedSubjects', selectedSubjects);
    // console.log('finalSubjects', subjects);
    this.googleCalendarService.removeSubjects(subjects)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.subjects = res.data;
          this.notificationService.add(`Materias removidas: ${res.data.length}/${subjects.length}`);
          this.form.reset();
          this.selectAll = false;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.notificationService.add('Error removiendo las materias seleccionadas, intenta de nuevo.');
          console.log('Error', err);
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
