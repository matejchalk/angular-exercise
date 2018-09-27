import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger('collapseExpand', [
      state('expanded', style({
        height: '*'
      })),
      state('collapsed', style({
        height: '0'
      })),
      transition('expanded <=> collapsed', [
        animate('0.3s')
      ])
    ])
  ]
})
export class CardComponent {
  show = true;
}
