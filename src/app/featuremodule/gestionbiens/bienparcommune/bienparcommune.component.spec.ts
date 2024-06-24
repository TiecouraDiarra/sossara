import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienparcommuneComponent } from './bienparcommune.component';

describe('BienparcommuneComponent', () => {
  let component: BienparcommuneComponent;
  let fixture: ComponentFixture<BienparcommuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienparcommuneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienparcommuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
