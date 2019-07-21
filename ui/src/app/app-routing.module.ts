import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ScheduleGuard } from './guards/schedule.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LoginComponent } from './pages/login/login.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PeriodSelectorComponent } from './components/period-selector/period-selector.component';
import { ExportCalendarComponent } from './components/export-calendar/export-calendar.component';
import { CalendarOptionsComponent } from './components/export-calendar/components/calendar-options/calendar-options.component';
import { SubjectsSelectorComponent } from './components/export-calendar/components/subjects-selector/subjects-selector.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

const routes: Routes = [
  // { path: '**', redirectTo: '' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
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
        component: ScheduleComponent,
        canActivate: [ScheduleGuard]
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
            component: SubjectsSelectorComponent,
            canActivate: [GoogleOauthGuard]
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
