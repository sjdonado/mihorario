import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private form: FormGroup;
  private title: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private appComponent: AppComponent,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;

    if (this.authService.token) {
      this.router.navigateByUrl('/home');
    }
    this.form = this.formBuilder.group({
      username: [, Validators.required],
      password: [, Validators.required]
    });
  }

  logIn() {
    this.authService.pomeloLogin(this.form.value).subscribe(
      (response: Response) => {
        console.log(response);
        const snackBarRef = this.snackBar.open('Message archived');
        snackBarRef.afterDismissed().subscribe(() => this.router.navigateByUrl('/home'));
    }, (err) => {
      console.log('Error: ' + err);
    });
  }

  get getFormGroup() {
    return this.form;
  }
}
