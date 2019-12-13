import { TestBed } from '@angular/core/testing';

import { GoogleCalendarService } from './google-calendar.service';

describe('GoogleCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleCalendarService = TestBed.get(GoogleCalendarService);
    expect(service).toBeTruthy();
  });
});
