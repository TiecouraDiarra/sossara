import { TestBed } from '@angular/core/testing';

import { BienimmoService } from './bienimmo.service';

describe('BienimmoService', () => {
  let service: BienimmoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienimmoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
