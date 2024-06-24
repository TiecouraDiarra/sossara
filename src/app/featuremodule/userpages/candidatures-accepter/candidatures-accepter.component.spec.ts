import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesAccepterComponent } from './candidatures-accepter.component';

describe('CandidaturesAccepterComponent', () => {
  let component: CandidaturesAccepterComponent;
  let fixture: ComponentFixture<CandidaturesAccepterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidaturesAccepterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturesAccepterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
