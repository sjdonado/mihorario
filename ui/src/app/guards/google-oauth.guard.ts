import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleOauthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate() {
    if (this.userService.googleOauthInfo) {
      return true;
    }
    this.router.navigateByUrl('/export/options');
  }
}
