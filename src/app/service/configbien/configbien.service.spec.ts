import { TestBed } from '@angular/core/testing';

import { configbienService } from './configbien.service';

describe('configbienService', () => {
  let service: configbienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(configbienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
