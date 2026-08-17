import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Nutrition, Product } from '../../services/product.model';
import { NutritionValuesComponent } from '../../shared/ui/nutrition-values';
import { NutritionTotalAmountsCardComponent } from '../../shared/ui/nutrition-total-amounts-card.component';

const HOST_BINDINGS = { class: 'block min-w-0' };

@Component({
  selector: 'app-daily-food-row',
  imports: [NutritionValuesComponent, NutritionTotalAmountsCardComponent],
  host: HOST_BINDINGS,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="grid min-w-0 gap-4 rounded-lg border border-stone-900/10 bg-white p-4 lg:grid-cols-[minmax(180px,1.25fr)_minmax(330px,2fr)_minmax(120px,0.7fr)_minmax(190px,1fr)] lg:items-center"
      data-test="daily-food-row"
      [attr.data-food-id]="product().id"
    >
      <div class="min-w-0">
        <strong class="block text-base font-black">{{ product().name }}</strong>
        <span class="text-xs font-extrabold tracking-wide text-emerald-700 uppercase">
          {{ product().kind }}
        </span>
        <small class="mt-1 block text-sm font-semibold text-stone-500">
          {{ product().servingSuggestion }}
        </small>
      </div>

      <app-nutrition-values [nutrition]="nutrition()" />

      <label class="grid gap-2 text-sm font-bold text-stone-600">
        <span>Amount (g)</span>
        <input
          class="min-h-11 w-full rounded-lg border border-stone-900/20 bg-white px-3 text-base font-extrabold text-stone-900 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15"
          data-test="food-quantity-input"
          type="number"
          min="0"
          max="5000"
          step="1"
          [attr.aria-label]="product().name + ' amount in grams'"
          [value]="quantity()"
          (input)="emitQuantity($event)"
        />
      </label>

      <app-nutrition-total-amounts-card
        [total]="total()"
        [nutritionToDisplay]="['carbs', 'protein', 'fat']"
        [attr.data-test]="'food-row-total'"
      />
    </article>
  `,
})
export class DailyFoodRowComponent {
  readonly product = input.required<Product>();
  readonly nutrition = input.required<Nutrition>();
  readonly quantity = input.required<number>();
  readonly total = input.required<Nutrition>();
  readonly quantityChange = output<string>();

  protected emitQuantity(event: Event): void {
    this.quantityChange.emit((event.target as HTMLInputElement).value);
  }

  protected format(value: number, unit: string, maximumFractionDigits: number): string {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value)} ${unit}`;
  }
}
