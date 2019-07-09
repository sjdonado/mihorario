import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { Subject } from '../models/subject.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private schedulePeriods: string[];
  private fullName: string;
  private title: string;
  private schedule: Subject[][];
  private isLoading: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    this.schedulePeriods = this.authService.pomeloData.options;
    this.fullName = this.authService.pomeloData.fullName;
  }

  getSchedule(scheduleOption: string) {
    console.log('scheduleOption', scheduleOption);
    this.isLoading = true;
    this.userService.getSchedule(scheduleOption).subscribe(
      (response: any) => {
        console.log(response);
        this.schedule = response.data.schedule;
        this.isLoading = false;
        // this.router.navigateByUrl('/home');
        // this.isLoading = false;
      }, (err) => {
        // this.isLoading = false;
        // this.snackBar.open('Error al iniciar sesión, intente de nuevo', 'Cerrar', { duration: 3000 });
        // console.log('Error: ' + err);
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
