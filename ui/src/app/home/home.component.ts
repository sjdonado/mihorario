import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private isLoading: boolean;
  private scheduleOptions: string[];
  private fullName: string;
  private title: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;

    this.isLoading = true;
    this.userService.getPomeloScheduleOptions().subscribe(
      (res: any) => {
        const { options, fullName } = res.data;
        this.scheduleOptions = options;
        this.fullName = fullName;
      },
      err => {
        console.error('cgetPomeloScheduleOptions error', err);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
