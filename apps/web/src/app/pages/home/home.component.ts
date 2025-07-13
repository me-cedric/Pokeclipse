import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@components/button/button.component';
import { FrameComponent } from '@components/frame/frame.component';
import { InputComponent } from '@components/input/input.component';
import { authClient } from 'src/app/utils/auth-client';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  async login() {
    const data = await authClient.signIn.social({
      provider: 'discord',
    });
    console.log(data);
  }
}
