import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsagenceComponent } from './detailsagence.component';

describe('DetailsagenceComponent', () => {
  let component: DetailsagenceComponent;
  let fixture: ComponentFixture<DetailsagenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsagenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsagenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
