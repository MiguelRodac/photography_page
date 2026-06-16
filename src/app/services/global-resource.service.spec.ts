import { TestBed } from '@angular/core/testing';

import { GlobalResourceService } from './global-resource.service';

describe('GlobalResourceService', () => {
  let service: GlobalResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
