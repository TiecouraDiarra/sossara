import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessusLancesComponent } from './processus-lances.component';

describe('ProcessusLancesComponent', () => {
  let component: ProcessusLancesComponent;
  let fixture: ComponentFixture<ProcessusLancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessusLancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessusLancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
