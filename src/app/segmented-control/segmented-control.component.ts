import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-segmented-control',
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.scss']
})
export class SegmentedControlComponent {
  @Input() options: { label: string, content: string }[] = [];
  @Input() selectedOptionIndex: number = 0;
  @Output() optionSelected = new EventEmitter<number>();

  selectOption(index: number) {
    this.selectedOptionIndex = index;
    this.optionSelected.emit(index);
  }
}
