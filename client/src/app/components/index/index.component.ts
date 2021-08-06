import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public title: string;
  @ViewChild('counter') counter: ElementRef;

  constructor(
    private appComponent: AppComponent,
    private statisticsService: StatisticsService,
  ) { }

  ngOnInit() {
    this.title = this.appComponent.title;
    this.statisticsService.getStatistics().subscribe(
      (response: any) => {
        this.animateValue(this.counter.nativeElement, 0, response.data.totalUsersCounter, 5000);
      }, (err) => {
        console.log('Error: ' + err);
      },
    );
  }

  animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}
