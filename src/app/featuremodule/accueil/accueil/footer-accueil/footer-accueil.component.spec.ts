import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAccueilComponent } from './footer-accueil.component';

describe('FooterNineComponent', () => {
  let component: FooterAccueilComponent;
  let fixture: ComponentFixture<FooterAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterAccueilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
