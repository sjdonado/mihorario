import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { Subject } from '../models/subject.model';
import { ConfirmationDialogComponent } from '../components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private schedulePeriods: string[];
  private fullName: string;
  private toolbarFullName: string;
  private title: string;
  private schedule: Subject[][];
  private scheduleMenuOption = 1;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appComponent: AppComponent,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    if (this.userService.schedule) {
      this.toolbarFullName = this.fullName;
      this.schedule = this.userService.schedule;
    } else {
      this.router.navigate(['/period']);
    }
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
