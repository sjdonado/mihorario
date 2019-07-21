import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/modules/home/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate() {
    if (this.userService.scheduleByHours) {
      return true;
    }
    this.router.navigateByUrl('/period');
  }
}
