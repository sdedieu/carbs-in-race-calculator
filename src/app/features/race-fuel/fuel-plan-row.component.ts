import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Nutrition, Product, ProductKind } from '../../services/product.model';
import { QuantityStepperComponent } from '../../shared/ui/quantity-stepper.component';
import { EMPTY_NUTRITION } from '../../services/product.service';
import { NutritionValuesComponent } from '../../shared/ui/nutrition-values';
import { NutritionTotalAmountsCardComponent } from '../../shared/ui/nutrition-total-amounts-card.component';

const HOST_BINDINGS = { class: 'block min-w-0' };
const PRODUCT_KIND_BASE_CLASSES = 'h-11 w-3.5 rounded-full';
const PRODUCT_KIND_CLASSES: Record<ProductKind, string> = {
  cereal: `${PRODUCT_KIND_BASE_CLASSES} bg-amber-600`,
  dairy: `${PRODUCT_KIND_BASE_CLASSES} bg-blue-500`,
  drink: `${PRODUCT_KIND_BASE_CLASSES} bg-blue-600`,
  electrolyte: `${PRODUCT_KIND_BASE_CLASSES} bg-teal-600`,
  fat: `${PRODUCT_KIND_BASE_CLASSES} bg-yellow-500`,
  fruit: `${PRODUCT_KIND_BASE_CLASSES} bg-rose-500`,
  gel: `${PRODUCT_KIND_BASE_CLASSES} bg-emerald-700`,
  jelly: `${PRODUCT_KIND_BASE_CLASSES} bg-orange-500`,
  legume: `${PRODUCT_KIND_BASE_CLASSES} bg-lime-600`,
  meat: `${PRODUCT_KIND_BASE_CLASSES} bg-red-600`,
  nuts: `${PRODUCT_KIND_BASE_CLASSES} bg-orange-700`,
  puree: `${PRODUCT_KIND_BASE_CLASSES} bg-rose-600`,
  sauce: `${PRODUCT_KIND_BASE_CLASSES} bg-rose-600`,
  seafood: `${PRODUCT_KIND_BASE_CLASSES} bg-cyan-600`,
  solid: `${PRODUCT_KIND_BASE_CLASSES} bg-amber-500`,
  sugar: `${PRODUCT_KIND_BASE_CLASSES} bg-pink-600`,
  vegetable: `${PRODUCT_KIND_BASE_CLASSES} bg-emerald-600`,
  fish: `${PRODUCT_KIND_BASE_CLASSES} bg-cyan-600`,
};

@Component({
  selector: 'app-fuel-plan-row',
  imports: [QuantityStepperComponent, NutritionValuesComponent, NutritionTotalAmountsCardComponent],
  host: HOST_BINDINGS,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="grid min-h-16 min-w-0 gap-3 rounded-lg border border-stone-900/10 bg-white p-3 lg:grid-cols-[minmax(0,1fr)_minmax(150px,1.6fr)_minmax(150px,170px)_minmax(150px,200px)] lg:items-center"
      role="row"
      data-test="plan-row"
    >
      <div class="grid min-w-0 grid-cols-[14px_minmax(0,1fr)] items-center gap-3" role="cell">
        <span [class]="productKindClasses()" aria-hidden="true"></span>
        <div class="min-w-0">
          <strong class="block [overflow-wrap:anywhere]">{{ product().name }}</strong>
          <small class="text-sm font-semibold text-stone-500">
            {{ product().brand || 'Everyday food' }} / {{ product().serving }}
          </small>
        </div>
      </div>

      <app-nutrition-values [nutrition]="nutrition()" />

      <div role="cell">
        <app-quantity-stepper
          [value]="quantity()"
          [label]="product().name"
          (valueChange)="emitQuantity($event)"
        />
      </div>

      <app-nutrition-total-amounts-card
        [total]="total()"
        [nutritionToDisplay]="['carbs', 'protein', 'fat']"
        [attr.data-test]="'food-row-total'"
      />
    </article>
  `,
})
export class FuelPlanRowComponent {
  readonly product = input.required<Product>();
  readonly quantity = input.required<number>();
  readonly total = input.required<Nutrition>();
  readonly quantityChange = output<string | number>();

  readonly nutrition = computed<Nutrition>(() => {
    return this.product().nutritionPer100g ?? EMPTY_NUTRITION;
  });

  protected readonly productKindClasses = computed(() => PRODUCT_KIND_CLASSES[this.product().kind]);

  protected emitQuantity(value: string | number): void {
    this.quantityChange.emit(value);
  }
}
