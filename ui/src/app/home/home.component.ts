import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { Subject } from '../models/subject.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private schedulePeriods: string[];
  private fullName: string;
  private toolbarFullName: string;
  private title: string;
  private schedule: Subject[][];
  private isLoading: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    this.schedulePeriods = this.authService.pomeloData.options;
    this.fullName = this.authService.pomeloData.fullName;
    if (this.userService.schedule) {
      this.toolbarFullName = this.fullName;
      this.schedule = this.userService.schedule.data.schedule;
    }
  }

  getSchedule(scheduleOption: string) {
    console.log('scheduleOption', scheduleOption);
    this.isLoading = true;
    this.userService.getSchedule(scheduleOption).subscribe(
      (response: any) => {
        console.log(response);
        this.schedule = response.data.schedule;
        this.toolbarFullName = this.fullName;
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
        this.snackBar.open('Error al obtener tu horario, intente de nuevo', 'Cerrar', { duration: 3000 });
        console.log('Error: ' + err);
      }
    );
  }

  periodSelector() {
    this.schedule = null;
    this.toolbarFullName = null;
  }

  logout() {
    this.authService.logout();
  }
}
