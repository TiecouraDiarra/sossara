import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsConversationComponent } from './details-conversation.component';

describe('DetailsConversationComponent', () => {
  let component: DetailsConversationComponent;
  let fixture: ComponentFixture<DetailsConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
