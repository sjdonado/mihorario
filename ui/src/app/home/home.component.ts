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

  private schedulePeriods: string[];
  private fullName: string;
  private title: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    this.schedulePeriods = this.authService.pomeloData.options;
    this.fullName = this.authService.pomeloData.fullName;

    // this.userService.getPomeloSchedulePeriods().subscribe(
    //   (res: any) => {
    //     const { options, fullName } = res.data;
    //     this.schedulePeriods = options;
    //     this.fullName = fullName;
    //   },
    //   err => {
    //     console.error('cgetPomeloSchedulePeriods error', err);
    //   },

    // );
  }

  logout() {
    this.authService.logout();
  }
}
