import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionbiensComponent } from './gestionbiens.component';

describe('GestionbiensComponent', () => {
  let component: GestionbiensComponent;
  let fixture: ComponentFixture<GestionbiensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionbiensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionbiensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
