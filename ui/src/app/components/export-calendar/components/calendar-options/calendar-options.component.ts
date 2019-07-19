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

  private googleOauthInfo: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.googleOauthInfo = this.userService.googleOauthInfo;
  }

  googleOauth() {
    if (this.userService.googleOauthInfo) {
      this.router.navigateByUrl('/export/select');
      return;
    }
    this.userService.googleOauthLogin()
      .subscribe(loginObservable => {
        loginObservable.subscribe(res => {
          console.log('res', res);
          if (res) {
            this.ngZone.run(() => {
              console.log('here')
              this.router.navigateByUrl('/export/select');
            });
          }
        });
      });
  }

  googleSignOut() {
    this.userService.removeGoogleOauthInfo();
    this.googleOauth();
  }

}
