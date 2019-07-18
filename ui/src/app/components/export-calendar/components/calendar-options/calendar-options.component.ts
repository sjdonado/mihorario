import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-options',
  templateUrl: './calendar-options.component.html',
  styleUrls: ['./calendar-options.component.scss']
})
export class CalendarOptionsComponent implements OnInit {

  private googleOauthInfo: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.googleOauthInfo = this.authService.googleOauthInfo;
  }

  googleOauth() {
    if (this.authService.googleOauthInfo) {
      this.router.navigateByUrl('/export/select');
      return;
    }
    this.authService.googleLogin()
      .subscribe(res => {
        if (res) {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/export/select');
          });
        }
      });
  }

  googleSignOut() {
    this.authService.removeGoogleOauthInfo();
    this.googleOauth();
  }

}
