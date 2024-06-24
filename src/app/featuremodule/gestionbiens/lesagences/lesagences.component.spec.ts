import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesagencesComponent } from './lesagences.component';

describe('LesagencesComponent', () => {
  let component: LesagencesComponent;
  let fixture: ComponentFixture<LesagencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LesagencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LesagencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
