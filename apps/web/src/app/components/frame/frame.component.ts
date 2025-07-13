import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-frame',
  standalone: true,
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent {
  /** Optional extra classes */
  @Input() className: string = '';

  /** Inline styles */
  @Input() style: { [klass: string]: any } = {};
}
