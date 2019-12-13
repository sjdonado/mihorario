import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ColorGithubModule } from 'ngx-color/github';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../components/home/home.component';
import { PeriodSelectorComponent } from '../../shared/period-selector/period-selector.component';
import { ScheduleComponent } from '../../shared/schedule/schedule.component';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ExportCalendarComponent } from '../../shared/export-calendar/export-calendar.component';
import { SubjectDetailsDialogComponent } from '../../shared/dialogs/subject-details-dialog/subject-details-dialog.component';
import { SubjectsSelectorComponent } from '../../shared/export-calendar/components/subjects-selector/subjects-selector.component';
import { CalendarOptionsComponent } from '../../shared/export-calendar/components/calendar-options/calendar-options.component';

@NgModule({
  declarations: [
    HomeComponent,
    PeriodSelectorComponent,
    ScheduleComponent,
    ConfirmationDialogComponent,
    ExportCalendarComponent,
    SubjectDetailsDialogComponent,
    SubjectsSelectorComponent,
    CalendarOptionsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ColorGithubModule,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    SubjectDetailsDialogComponent
  ]
})
export class HomeModule { }
