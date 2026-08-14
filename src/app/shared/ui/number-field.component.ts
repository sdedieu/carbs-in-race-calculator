import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-number-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="grid gap-2 text-sm font-bold text-stone-600" [attr.data-test]="dataTest()">
      <span>{{ label() }}</span>
      <input
        class="min-h-11 rounded-lg border border-stone-900/20 bg-white px-3 text-base font-extrabold text-stone-900 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15"
        data-test="number-field-input"
        type="number"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        (input)="emitValue($any($event.target).value)"
      />
    </label>
  `,
})
export class NumberFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly min = input<number>(0);
  readonly max = input<number>(999);
  readonly step = input<number>(1);
  readonly dataTest = input<string>('number-field');
  readonly valueChange = output<string>();

  protected emitValue(value: string): void {
    this.valueChange.emit(value);
  }
}
