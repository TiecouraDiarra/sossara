import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrouverbienComponent } from './trouverbien.component';

describe('TrouverbienComponent', () => {
  let component: TrouverbienComponent;
  let fixture: ComponentFixture<TrouverbienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrouverbienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrouverbienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
