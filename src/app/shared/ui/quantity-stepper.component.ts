import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

const HOST_BINDINGS = { class: 'block min-w-0' };

@Component({
  selector: 'app-quantity-stepper',
  host: HOST_BINDINGS,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grid max-w-56 min-w-0 grid-cols-[40px_minmax(62px,1fr)_40px] gap-1.5"
      data-test="quantity-stepper"
    >
      <button
        class="min-h-10 rounded-lg border border-stone-900/15 bg-white font-black text-stone-900 hover:border-emerald-700/45 hover:bg-emerald-50"
        data-test="decrease-quantity"
        type="button"
        (click)="decrease()"
        [attr.aria-label]="'Reduce ' + label()"
      >
        -
      </button>
      <input
        class="min-h-10 rounded-lg border border-stone-900/20 bg-white px-1.5 text-center font-extrabold text-stone-900 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15"
        data-test="quantity-input"
        type="number"
        min="0"
        max="99"
        step="0.25"
        [value]="value()"
        (input)="emitValue($any($event.target).value)"
        [attr.aria-label]="label() + ' quantity'"
      />
      <button
        class="min-h-10 rounded-lg border border-stone-900/15 bg-white font-black text-stone-900 hover:border-emerald-700/45 hover:bg-emerald-50"
        data-test="increase-quantity"
        type="button"
        (click)="increase()"
        [attr.aria-label]="'Increase ' + label()"
      >
        +
      </button>
    </div>
  `,
})
export class QuantityStepperComponent {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly step = input<number>(1);
  readonly valueChange = output<string | number>();

  protected decrease(): void {
    this.valueChange.emit(this.value() - this.step());
  }

  protected increase(): void {
    this.valueChange.emit(this.value() + this.step());
  }

  protected emitValue(value: string): void {
    this.valueChange.emit(value);
  }
}
