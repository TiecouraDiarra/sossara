import { TestBed } from '@angular/core/testing';

import { CommoditeService } from './commodite.service';

describe('CommoditeService', () => {
  let service: CommoditeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommoditeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
