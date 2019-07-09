import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {

  public form: FormGroup;
  @Input() fullName: string;
  @Input() schedulePeriods: string[];
  @Output() optionSelected = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      schedulePeriod: [, Validators.required],
    });
  }

  getSchedule() {
    this.optionSelected.emit(this.form.value.schedulePeriod);
  }

  get getFormGroup() {
    return this.form;
  }

}
