import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() value: string = '';
  @Input() className: string = '';
  @Input() style: { [klass: string]: any } = {};
  @Input() size: number = 10;
  @Input() type: 'text' | 'password' | 'number' | 'tel' = 'text';
  @Input() onlyNumber: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  arrayValue: string[] = [];

  @ViewChildren('inputRef') inputRefs!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnInit(): void {
    if (this.value && this.value.length === this.size) {
      this.arrayValue = this.value.split('');
    } else {
      this.arrayValue = Array(this.size).fill('');
    }
  }

  numberMask(num: string): string {
    return num.replace(/\D/g, '');
  }

  handleInput(event: Event, i: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    const prevChar = this.arrayValue[i];
    let char = '';

    if (this.onlyNumber) {
      const filtered = this.numberMask(input.value);
      if (filtered.length > 0) {
        char = filtered[filtered.length - 1];
      }
    } else {
      char = input.value[input.value.length - 1];
    }

    if (!char || char === prevChar) return;

    this.updateValue(char, i);

    // Move to next input
    if (i < this.size - 1) {
      this.inputRefs.get(i + 1)?.nativeElement.focus();
    }
  }

  handleKeyDown(event: KeyboardEvent, i: number): void {
    if (event.key === ' ') {
      event.preventDefault();
      this.updateValue(' ', i);
      if (i < this.size - 1) {
        this.inputRefs.get(i + 1)?.nativeElement.focus();
      }
    } else if (event.key === 'ArrowLeft' && i > 0) {
      this.inputRefs.get(i - 1)?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && i < this.size - 1) {
      this.inputRefs.get(i + 1)?.nativeElement.focus();
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.arrayValue[i]) {
        // Case 1: Current box has a character, just clear it
        this.updateValue('', i);
        // Keep focus in current
        this.inputRefs.get(i)?.nativeElement.focus();
      } else if (i > 0) {
        // Case 2: Current is empty, move left and clear previous
        this.updateValue('', i - 1);
        this.inputRefs.get(i - 1)?.nativeElement.focus();
      }
    } else if (event.key === 'Delete') {
      event.preventDefault();
      this.updateValue('', i);
    }
  }

  updateValue(char: string, index: number): void {
    const result = [...this.arrayValue];

    if (char === '') {
      result[index] = '';
    } else {
      // If current slot is empty, just write the char without shifting
      if (result[index] === '') {
        result[index] = char;
      } else {
        // Shift right only if current slot is occupied
        for (let j = this.size - 1; j > index; j--) {
          result[j] = result[j - 1];
        }
        result[index] = char;
      }
    }

    this.arrayValue = result;
    this.emitChange();
  }

  emitChange(): void {
    this.valueChange.emit(this.arrayValue.join(''));
  }
}
