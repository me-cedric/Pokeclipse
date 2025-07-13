import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@components/button/button.component';
import { FrameComponent } from '@components/frame/frame.component';
import { InputComponent } from '@components/input/input.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    FrameComponent,
    InputComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  value = '';

  onChange(newValue: string): void {
    if (newValue !== this.value) {
      this.value = newValue ?? '';
    }
  }
}
