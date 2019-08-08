import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/home/services/user.service';

@Component({
  selector: 'app-calendar-options',
  templateUrl: './calendar-options.component.html',
  styleUrls: ['./calendar-options.component.scss']
})
export class CalendarOptionsComponent implements OnInit {

  public googleOauthData: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.googleOauthData = this.userService.googleOauthData;
  }

  googleOauth() {
    if (this.userService.googleOauthData) {
      this.router.navigateByUrl('/home/export/select');
      return;
    }
    this.userService.googleOauthLogin()
      .subscribe(res => {
        if (res) {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/home/export/select');
          });
        }
      });
  }

  signInWithAnotherAccount() {
    this.userService.removeGoogleOauthData();
    this.googleOauth();
  }

}
