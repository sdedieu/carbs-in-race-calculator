import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Nutrition } from '../../services/product.model';

@Component({
  selector: 'app-nutrition-values',
  host: {
    class: 'grid min-w-0 grid-cols-3 gap-x-3 gap-y-2 text-sm sm:grid-cols-6',
    '[attr.data-test]': '"per-100g-values"',
  },
  template: `
    <div>
      <dt class="font-bold text-stone-500">Energy</dt>
      <dd class="font-black">{{ format(nutrition().calories, 'kcal', 0) }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Carbs</dt>
      <dd class="font-black">{{ format(nutrition().carbs, 'g', 1) }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Sugar</dt>
      <dd class="font-black">{{ format(nutrition().sugar, 'g', 1) }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Fiber</dt>
      <dd class="font-black">{{ format(nutrition().fiber, 'g', 1) }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Fat</dt>
      <dd class="font-black">{{ format(nutrition().fat, 'g', 1) }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Protein</dt>
      <dd class="font-black">{{ format(nutrition().protein, 'g', 1) }}</dd>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutritionValuesComponent {
  readonly nutrition = input.required<Nutrition>();

  protected format(value: number, unit: string, maximumFractionDigits: number): string {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value)} ${unit}`;
  }
}
