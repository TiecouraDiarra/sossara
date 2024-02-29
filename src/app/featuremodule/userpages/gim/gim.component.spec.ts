import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GimComponent } from './gim.component';

describe('GimComponent', () => {
  let component: GimComponent;
  let fixture: ComponentFixture<GimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
