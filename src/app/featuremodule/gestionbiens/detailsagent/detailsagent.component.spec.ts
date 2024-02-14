import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsagentComponent } from './detailsagent.component';

describe('DetailsagentComponent', () => {
  let component: DetailsagentComponent;
  let fixture: ComponentFixture<DetailsagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsagentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
