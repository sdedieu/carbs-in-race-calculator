import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
      <dd class="font-black">{{ labels().calories }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Carbs</dt>
      <dd class="font-black">{{ labels().carbs }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Sugar</dt>
      <dd class="font-black">{{ labels().sugar }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Fiber</dt>
      <dd class="font-black">{{ labels().fiber }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Fat</dt>
      <dd class="font-black">{{ labels().fat }}</dd>
    </div>
    <div>
      <dt class="font-bold text-stone-500">Protein</dt>
      <dd class="font-black">{{ labels().protein }}</dd>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutritionValuesComponent {
  readonly nutrition = input.required<Nutrition>();

  protected readonly labels = computed(() => {
    const nutrition = this.nutrition();

    return {
      calories: this.format(nutrition.calories, 'kcal', 0),
      carbs: this.format(nutrition.carbs, 'g', 1),
      sugar: this.format(nutrition.sugar, 'g', 1),
      fiber: this.format(nutrition.fiber, 'g', 1),
      fat: this.format(nutrition.fat, 'g', 1),
      protein: this.format(nutrition.protein, 'g', 1),
    };
  });

  private format(value: number, unit: string, maximumFractionDigits: number): string {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value)} ${unit}`;
  }
}
