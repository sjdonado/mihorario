import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private form: FormGroup;
  public title: string;
  public isLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private appComponent: AppComponent,
    private router: Router,
    private notificationService: NotificationService
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

  login() {
    this.isLoading = true;
    this.authService.pomeloLogin(this.form.value).subscribe(
      (response: Response) => {
        console.log(response);
        this.router.navigateByUrl('/home');
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
        this.notificationService.add('Error al iniciar sesión, intente de nuevo.');
        console.log('Error: ' + err);
      },
    );
  }

  get getFormGroup() {
    return this.form;
  }
}
