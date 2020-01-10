import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/components/home/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Term } from 'src/app/models/term.model';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {

  public form: FormGroup;
  public isLoading: boolean;
  private name: string;
  private terms: Term[];
  private showGoBackButton: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.showGoBackButton = this.userService.scheduleByHours !== null;
  }

  ngOnInit() {
    this.terms = this.authService.pomeloData.terms;
    this.name = this.authService.pomeloData.fullName.split(' ')[0];
    this.form = this.formBuilder.group({
      termId: [, Validators.required],
    });
  }

  getSchedule() {
    this.isLoading = true;
    this.userService.getSchedule(this.form.value.termId).subscribe(
      (response: any) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      }, (err) => {
        this.isLoading = false;
        this.notificationService.add('Error al obtener tu horario, intente de nuevo.');
        console.log('Error: ' + err);
      }
    );
  }

  get getFormGroup() {
    return this.form;
  }

}
