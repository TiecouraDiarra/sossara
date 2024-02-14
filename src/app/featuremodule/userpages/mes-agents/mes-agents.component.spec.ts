import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesAgentsComponent } from './mes-agents.component';

describe('MesAgentsComponent', () => {
  let component: MesAgentsComponent;
  let fixture: ComponentFixture<MesAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesAgentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
