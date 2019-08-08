import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/components/home/services/user.service';
import { AuthService } from '../../services/auth.service';
import { AppComponent } from '../../app.component';
import { Subject } from '../../models/subject.model';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public fullName: string;
  public title: string;
  private schedule: Subject[][];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent,
    private router: Router,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    this.fullName = this.authService.pomeloData.fullName;
    this.schedule = this.userService.scheduleByHours;
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: `${window.innerWidth / 4 > 320 ? window.innerWidth / 4 : 320 }px`,
      data: { title: 'Cerrar sesión', message: '¿Estás seguro?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          localStorage.clear();
          this.router.navigateByUrl('/login');
          // this.userService.logout()
          //   .subscribe(
          //     (res: any) => {
          //       console.log('logout res', res);
          //       if (!res.data) {
          //         this.notificationService.add('Error al cerrar sesión, intenta de nuevo.');
          //       }

          //     },
          //     (err) => {
          //       console.log('logoutErr', err);
          //       localStorage.clear();
          //       this.router.navigateByUrl('/login');
          //     }
          //   );
        }
      });
  }
}
