import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesAnnulerComponent } from './candidatures-annuler.component';

describe('CandidaturesAnnulerComponent', () => {
  let component: CandidaturesAnnulerComponent;
  let fixture: ComponentFixture<CandidaturesAnnulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidaturesAnnulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturesAnnulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
