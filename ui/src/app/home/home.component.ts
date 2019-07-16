import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { Subject } from '../models/subject.model';
import { ConfirmationDialogComponent } from '../components/dialogs/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private fullName: string;
  private title: string;
  private schedule: Subject[][];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    this.fullName = this.authService.pomeloData.fullName;
    this.schedule = this.userService.schedule;
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: `${window.innerWidth / 4 > 320 ? window.innerWidth / 4 : 320 }px`,
      data: { title: 'Cerrar sesión', message: '¿Estás seguro?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
