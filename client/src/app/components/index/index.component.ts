import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public title: string;

  constructor(
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
  }

}