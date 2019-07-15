import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectDetailsDialogComponent } from './subject-details-dialog.component';

describe('SubjectDetailsDialogComponent', () => {
  let component: SubjectDetailsDialogComponent;
  let fixture: ComponentFixture<SubjectDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
