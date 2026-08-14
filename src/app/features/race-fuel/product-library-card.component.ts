import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Nutrition, Product, ProductKind } from '../../services/product.model';

@Component({
  selector: 'app-product-library-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="grid gap-3 rounded-lg border border-stone-900/10 bg-white p-4"
      data-test="product-card"
    >
      <div class="flex items-center justify-between gap-3">
        <span [class]="productKindBadgeClasses(product().kind)">
          {{ product().kind }}
        </span>
        @if (product().sourceUrl) {
          <a
            class="text-sm font-extrabold text-emerald-700 hover:underline"
            [href]="product().sourceUrl"
            target="_blank"
            rel="noopener"
          >
            {{ product().sourceLabel }}
          </a>
        } @else {
          <span class="text-sm font-extrabold text-stone-500">Reference food</span>
        }
      </div>
      <h3 class="text-base font-black tracking-normal text-pretty">{{ product().name }}</h3>
      <p class="text-sm font-semibold text-stone-500">{{ product().serving }}</p>
      <dl class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div class="grid gap-1">
          <dt class="text-xs font-extrabold text-stone-500 uppercase">Carbs</dt>
          <dd class="font-black">{{ format(nutrition().carbs, 'g', 1) }}</dd>
        </div>
        <div class="grid gap-1">
          <dt class="text-xs font-extrabold text-stone-500 uppercase">Calories</dt>
          <dd class="font-black">{{ format(nutrition().calories, 'kcal', 0) }}</dd>
        </div>
        <div class="grid gap-1">
          <dt class="text-xs font-extrabold text-stone-500 uppercase">Sugar</dt>
          <dd class="font-black">{{ format(nutrition().sugar, 'g', 1) }}</dd>
        </div>
        <div class="grid gap-1">
          <dt class="text-xs font-extrabold text-stone-500 uppercase">Fat</dt>
          <dd class="font-black">{{ format(nutrition().fat, 'g', 1) }}</dd>
        </div>
        <div class="grid gap-1">
          <dt class="text-xs font-extrabold text-stone-500 uppercase">Fiber</dt>
          <dd class="font-black">{{ format(nutrition().fiber, 'g', 1) }}</dd>
        </div>
        <div class="grid gap-1">
          <dt class="text-xs font-extrabold text-stone-500 uppercase">Protein</dt>
          <dd class="font-black">{{ format(nutrition().protein, 'g', 1) }}</dd>
        </div>
      </dl>
      <small class="text-sm font-semibold text-stone-500">{{ micronutrients() }}</small>
    </article>
  `,
})
export class ProductLibraryCardComponent {
  readonly product = input.required<Product>();
  readonly nutrition = input.required<Nutrition>();

  protected format(value: number, unit = '', maximumFractionDigits = 0): string {
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits,
      minimumFractionDigits: value > 0 && value < 1 ? 1 : 0,
    }).format(value);

    return unit ? `${formatted} ${unit}` : formatted;
  }

  protected micronutrients(): string {
    const nutrition = this.nutrition();
    const entries = [
      nutrition.caffeine > 0 ? `${this.format(nutrition.caffeine, 'mg')} caffeine` : '',
      nutrition.sodium > 0 ? `${this.format(nutrition.sodium, 'mg')} sodium` : '',
      nutrition.potassium > 0 ? `${this.format(nutrition.potassium, 'mg')} potassium` : '',
      nutrition.magnesium > 0 ? `${this.format(nutrition.magnesium, 'mg', 1)} magnesium` : '',
      nutrition.calcium > 0 ? `${this.format(nutrition.calcium, 'mg')} calcium` : '',
    ].filter(Boolean);

    return entries.join(' / ') || 'No notable extras';
  }

  protected productKindBadgeClasses(kind: ProductKind): string {
    const base = 'rounded-full px-2.5 py-1 text-xs font-black uppercase';
    const classes: Record<ProductKind, string> = {
      cereal: `${base} bg-amber-50 text-amber-700`,
      dairy: `${base} bg-blue-50 text-blue-700`,
      drink: `${base} bg-blue-50 text-blue-700`,
      electrolyte: `${base} bg-teal-50 text-teal-700`,
      fat: `${base} bg-yellow-50 text-yellow-700`,
      fruit: `${base} bg-rose-50 text-rose-700`,
      gel: `${base} bg-emerald-50 text-emerald-700`,
      jelly: `${base} bg-orange-50 text-orange-700`,
      legume: `${base} bg-lime-50 text-lime-700`,
      meat: `${base} bg-red-50 text-red-700`,
      nuts: `${base} bg-orange-50 text-orange-800`,
      puree: `${base} bg-rose-50 text-rose-700`,
      seafood: `${base} bg-cyan-50 text-cyan-700`,
      solid: `${base} bg-amber-50 text-amber-700`,
      sugar: `${base} bg-pink-50 text-pink-700`,
      vegetable: `${base} bg-emerald-50 text-emerald-700`,
    };

    return classes[kind];
  }
}
