import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LandingService } from './landing.service';

describe('LandingService', () => {
  let service: LandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule ],
    });
    service = TestBed.inject(LandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
