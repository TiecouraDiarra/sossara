import { TestBed } from '@angular/core/testing';

import { ModepaiementService } from './modepaiement.service';

describe('AdresseService', () => {
  let service: ModepaiementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModepaiementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
