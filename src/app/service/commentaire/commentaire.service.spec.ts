import { TestBed } from '@angular/core/testing';

import { notificationService } from './notification.service';

describe('notificationService', () => {
  let service: notificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(notificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
