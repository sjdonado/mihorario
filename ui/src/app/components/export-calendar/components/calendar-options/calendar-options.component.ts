import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { observable } from 'rxjs';

@Component({
  selector: 'app-calendar-options',
  templateUrl: './calendar-options.component.html',
  styleUrls: ['./calendar-options.component.scss']
})
export class CalendarOptionsComponent implements OnInit {

  public googleOauthEmail: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.googleOauthEmail = this.userService.googleOauthEmail;
  }

  googleOauth() {
    if (this.userService.googleOauthEmail) {
      this.router.navigateByUrl('/export/select');
      return;
    }
    this.userService.googleOauthLogin()
      .subscribe(loginObservable => {
        loginObservable.subscribe(res => {
          console.log('res', res);
          if (res) {
            this.ngZone.run(() => {
              this.router.navigateByUrl('/export/select');
            });
          }
        });
      });
  }

  signInWithAnotherAccount() {
    this.userService.removeGoogleOauthEmail();
    this.googleOauth();
  }

}
