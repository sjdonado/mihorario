import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsSelectorComponent } from './subjects-selector.component';

describe('SubjectsSelectorComponent', () => {
  let component: SubjectsSelectorComponent;
  let fixture: ComponentFixture<SubjectsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
