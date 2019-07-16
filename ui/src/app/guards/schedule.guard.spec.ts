import { TestBed, async, inject } from '@angular/core/testing';

import { ScheduleGuard } from './schedule.guard';

describe('ScheduleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduleGuard]
    });
  });

  it('should ...', inject([ScheduleGuard], (guard: ScheduleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
