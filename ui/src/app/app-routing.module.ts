import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PeriodSelectorComponent } from './components/period-selector/period-selector.component';
import { ExportCalendarComponent } from './components/export-calendar/export-calendar.component';
import { CalendarOptionsComponent } from './components/export-calendar/components/calendar-options/calendar-options.component';
import { SelectSubjectsComponent } from './components/export-calendar/components/select-subjects/select-subjects.component';

const routes: Routes = [
  // { path: '**', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'schedule',
        pathMatch: 'full'
      },
      {
        path: 'schedule',
        component: ScheduleComponent
      },
      {
        path: 'period',
        component: PeriodSelectorComponent,
      },
      {
        path: 'export',
        component: ExportCalendarComponent,
        children: [
          {
            path: '',
            redirectTo: 'options',
            pathMatch: 'full'
          },
          {
            path: 'options',
            component: CalendarOptionsComponent
          },
          {
            path: 'select',
            component: SelectSubjectsComponent
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
