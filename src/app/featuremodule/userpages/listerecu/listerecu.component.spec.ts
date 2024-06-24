import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerecuComponent } from './listerecu.component';

describe('ListerecuComponent', () => {
  let component: ListerecuComponent;
  let fixture: ComponentFixture<ListerecuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerecuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListerecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
