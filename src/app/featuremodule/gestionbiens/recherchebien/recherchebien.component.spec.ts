import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecherchebienComponent } from './recherchebien.component';

describe('RecherchebienComponent', () => {
  let component: RecherchebienComponent;
  let fixture: ComponentFixture<RecherchebienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecherchebienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecherchebienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
