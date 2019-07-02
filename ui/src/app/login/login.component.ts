import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [, Validators.required],
      password: [, Validators.required]
    });
  }

  logIn() {
    this.authService.pomeloLogin(this.form.value).subscribe(
      (response: Response) => {
        console.log(response);
        this.router.navigateByUrl('/home');
    }, (err) => {
      console.log('Error: ' + err);
    });
  }

  get getFormGroup() {
    return this.form;
  }
}
