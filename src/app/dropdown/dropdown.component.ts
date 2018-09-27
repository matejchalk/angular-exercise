import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  @Input() options: any[];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @Input() hideIcon: boolean;
  @Input() requireClick: boolean;
  show = false;
  active: number | null = null;
  timerID: number | null = null;

  ngOnInit() {
    if (this.value === undefined && this.options.length > 0) {
      this.value = this.options[0];
    }
  }

  select(i: number): void {
    this.value = this.options[i];
    this.show = false;
    this.active = null;
    this.valueChange.emit(this.value);
  }

  startTimer(): void {
    this.endTimer();
    this.timerID = setTimeout(() => this.show = false, 500);
  }

  endTimer(): void {
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
    }
  }
}
