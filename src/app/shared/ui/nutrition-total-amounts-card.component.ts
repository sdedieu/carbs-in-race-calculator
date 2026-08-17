import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Nutrition } from '../../services/product.model';

@Component({
  selector: 'app-nutrition-total-amounts-card',
  host: {
    class: 'rounded-lg bg-stone-100 px-3 py-2',
  },
  template: `
    <span class="block text-xs font-extrabold text-stone-500 uppercase">Amount total</span>
    <strong class="block text-lg font-black">
      {{ format(total().calories, 'kcal', 0) }}
    </strong>
    <small class="font-bold text-stone-600">
      {{ nutritionLabels() }}
    </small>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutritionTotalAmountsCardComponent {
  readonly total = input.required<Nutrition>();

  readonly nutritionToDisplay = input.required<(keyof Nutrition)[]>();

  readonly nutritionLabels = computed(() =>
    this.nutritionToDisplay()
      .map((key) => `${this.format(this.total()[key], 'g', 1)} ${key}`)
      .join(' · '),
  );

  protected format(value: number, unit: string, maximumFractionDigits: number): string {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value)} ${unit}`;
  }
}
