import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {

  public form: FormGroup;
  private isLoading: boolean;
  private name: string;
  private schedulePeriods: string[];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.schedulePeriods = this.authService.pomeloData.options;
    this.name = this.authService.pomeloData.fullName.split(' ')[0];
    this.form = this.formBuilder.group({
      schedulePeriod: [, Validators.required],
    });
  }

  getSchedule(scheduleOption: string) {
    console.log('scheduleOption', scheduleOption);
    this.isLoading = true;
    this.userService.getSchedule(scheduleOption).subscribe(
      (response: any) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/']);
      }, (err) => {
        this.isLoading = false;
        this.snackBar.open('Error al obtener tu horario, intente de nuevo', 'Cerrar', { duration: 3000 });
        console.log('Error: ' + err);
      }
    );
  }

  get getFormGroup() {
    return this.form;
  }

}
