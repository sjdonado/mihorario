import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PeriodSelectorComponent } from './components/period-selector/period-selector.component';
import { ExportCalendarComponent } from './components/export-calendar/export-calendar.component';

const routes: Routes = [
  // { path: '**', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ScheduleComponent
      },
      {
        path: 'period',
        component: PeriodSelectorComponent
      },
      {
        path: 'export',
        component: ExportCalendarComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
