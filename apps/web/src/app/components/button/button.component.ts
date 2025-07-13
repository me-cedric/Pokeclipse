import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  /** Additional classes for wrapper div */
  @Input() className: string = '';

  /** Inline styles for wrapper div */
  @Input() style: { [klass: string]: any } = {};

  /** Disable the button */
  @Input() disabled: boolean = false;

  /** Background color */
  @Input() color?: string;

  /** Whether to reverse font color and apply stroke */
  @Input() reverseFont: boolean = false;

  /** Click event */
  @Output() clicked = new EventEmitter<void>();

  get buttonStyles() {
    return {
      'background-color': this.color ?? undefined,
      'color': this.reverseFont ? 'white' : 'black',
      '-webkit-text-stroke': this.reverseFont ? '5px black' : undefined,
      'paint-order': this.reverseFont ? 'stroke fill' : undefined,
    };
  }
}
