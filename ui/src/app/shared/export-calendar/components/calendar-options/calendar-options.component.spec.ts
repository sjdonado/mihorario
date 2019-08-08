import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOptionsComponent } from './calendar-options.component';

describe('CalendarOptionsComponent', () => {
  let component: CalendarOptionsComponent;
  let fixture: ComponentFixture<CalendarOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
