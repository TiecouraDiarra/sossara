import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsbienComponent } from './detailsbien.component';

describe('DetailsbienComponent', () => {
  let component: DetailsbienComponent;
  let fixture: ComponentFixture<DetailsbienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsbienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsbienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
