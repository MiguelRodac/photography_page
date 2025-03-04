import { TestBed } from '@angular/core/testing';

import { GlobalResourseService } from './global-resourse.service';

describe('GlobalResourseService', () => {
  let service: GlobalResourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalResourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
