import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

const animationDuration: number = 0.2;

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgIf],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
  animations: [
    trigger('cardOpenClose', [
      state('open', style({
        transform: 'scale(1)',
      })),
      transition(':leave', animate(animationDuration + 's ease', style({
        transform: 'scale(0.2)',
        opacity: '0'
      })))
    ]),
    trigger('containerOpenClose', [
      state('open', style({
        backdropFilter: 'blur(5px)',
      })),
      transition(':leave', group([
        query('@cardOpenClose', animateChild()),
        animate(animationDuration + 's ease', 
          style({
            backdropFilter: "blur(0)",
          }))
        ])
        ),
    ])
  ]
})
export class PopupComponent {
  @Input() appear: boolean = false;
  @Output() appearChange = new EventEmitter<boolean>();
  @Input() width: number = 70;
  @Input() height: number = 70;
  
  handleExit(){
    this.appear = false;
    this.appearChange.emit(this.appear);
  }
  
  handlePopupClick(event: Event) {
    event.stopPropagation();
  }
}
