import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCalendarComponent } from './export-calendar.component';

describe('ExportCalendarComponent', () => {
  let component: ExportCalendarComponent;
  let fixture: ComponentFixture<ExportCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
