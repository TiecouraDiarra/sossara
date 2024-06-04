import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfilComponent } from './complete-profil.component';

describe('CompleteProfilComponent', () => {
  let component: CompleteProfilComponent;
  let fixture: ComponentFixture<CompleteProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
