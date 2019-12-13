import { TestBed, async, inject } from '@angular/core/testing';

import { GoogleOauthGuard } from './google-oauth.guard';

describe('GoogleOauthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleOauthGuard]
    });
  });

  it('should ...', inject([GoogleOauthGuard], (guard: GoogleOauthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
