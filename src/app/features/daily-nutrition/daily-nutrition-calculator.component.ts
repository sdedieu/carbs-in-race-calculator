import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Nutrition, Product, ProductId } from '../../services/product.model';
import { DailyNutritionState, DailyNutritionStatus } from './+state/daily-nutrition-state';
import { DailyFoodRowComponent } from './daily-food-row.component';

interface GoalStatusCard {
  key: 'calories' | 'protein' | 'fat' | 'carbs' | 'sugar';
  label: string;
  goalValue: string;
  currentValue: string;
  progress: number;
  progressDetail: string;
  progressColor: string;
  textColor: string;
  detail: string;
  color: string;
}

interface TotalCard {
  key: keyof Nutrition;
  label: string;
  value: string;
  goal: string;
}

interface NutritionStatus {
  state: 'under target' | 'on target' | 'over target';
  detail: string;
  progress: number;
}

const HOST_BINDINGS = { class: 'block' };

@Component({
  selector: 'app-daily-nutrition-calculator',
  imports: [DailyFoodRowComponent],
  host: HOST_BINDINGS,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="grid gap-5"
      aria-labelledby="daily-nutrition-title"
      data-test="daily-nutrition-calculator"
    >
      <section
        class="grid items-center gap-6 rounded-lg border border-stone-900/10 bg-white/90 p-4 shadow-xl shadow-stone-900/5 lg:grid-cols-[minmax(260px,1fr)_minmax(280px,0.8fr)_minmax(250px,360px)] lg:p-6"
        data-test="daily-settings"
      >
        <div>
          <p class="mb-2 text-xs font-extrabold tracking-widest text-teal-700 uppercase">
            Everyday nutrition
          </p>
          <h1
            id="daily-nutrition-title"
            class="max-w-[720px] text-4xl leading-none font-black text-balance sm:text-6xl"
          >
            Daily fuel calculator
          </h1>
          <p class="mt-3 max-w-2xl font-semibold text-stone-600">
            Set your calorie target and body mass, then build a day from food amounts in grams.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Daily nutrition settings">
          <label class="grid gap-2 text-sm font-bold text-stone-600" data-test="calorie-target">
            <span>BMR (kcal)</span>
            <input
              class="min-h-11 rounded-lg border border-stone-900/20 bg-white px-3 text-base font-extrabold text-stone-900 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
              data-test="calorie-target-input"
              type="number"
              min="0"
              max="10000"
              step="50"
              [value]="calorieTarget()"
              (input)="setCalorieTarget($event)"
            />
          </label>

          <label class="grid gap-2 text-sm font-bold text-stone-600" data-test="body-mass">
            <span>Body mass (kg)</span>
            <input
              class="min-h-11 rounded-lg border border-stone-900/20 bg-white px-3 text-base font-extrabold text-stone-900 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
              data-test="body-mass-input"
              type="number"
              min="0"
              max="500"
              step="0.1"
              [value]="bodyMassKg()"
              (input)="setBodyMass($event)"
            />
          </label>
        </div>

        <div [class]="calorieStatusClasses()" data-test="daily-calorie-status">
          <div class="flex items-end justify-between gap-4">
            <span class="text-xs font-black tracking-wide uppercase">
              {{ calorieStatus().state }}
            </span>
            <strong class="text-lg whitespace-nowrap">
              {{ format(totals().calories, 'kcal', 0) }} /
              {{ format(goals().calorieMinimum, 'kcal', 0) }}
            </strong>
          </div>
          <progress
            [class]="
              'h-2 w-full overflow-hidden rounded-full accent-teal-700 [&::-webkit-progress-bar]:bg-gray-200 ' +
              calorieProgressColor()
            "
            [class.accent-orange-600]="calorieStatus().state === 'over target'"
            [value]="calorieStatus().progress"
            max="100"
            aria-label="Daily calorie target progress"
          ></progress>
          <small class="font-bold text-stone-600">{{ calorieStatus().detail }}</small>
        </div>
      </section>

      <section
        class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Daily macro goals"
        data-test="macro-goals"
      >
        @for (card of goalStatusCards(); track card.key) {
          <article [class]="goalCardClasses(card.color)" [attr.data-test]="card.key + '-goal'">
            <div>
              <div class="flex items-end justify-between gap-4">
                <span [class]="'text-xs font-extrabold uppercase ' + card.textColor">{{
                  card.label
                }}</span>

                <strong [class]="'text-base font-extrabold uppercase ' + card.textColor"
                  >{{ card.currentValue }}
                  @if (card.goalValue) {
                    <span class="text-xs"> / {{ card.goalValue }}</span>
                  }
                </strong>
              </div>
              <div class="flex items-end">
                <small class="ml-auto font-bold text-stone-500">{{ card.detail }}</small>
              </div>
            </div>
            <progress
              [class]="
                'h-2 w-full overflow-hidden rounded-full accent-teal-700 [&::-webkit-progress-bar]:bg-gray-200 ' +
                card.progressColor
              "
              [value]="card.progress"
              max="100"
              [aria-label]="'Daily ' + card.label + ' target progress'"
            ></progress>
            <small class="font-bold text-stone-500">{{ card.progressDetail }}</small>
          </article>
        }
      </section>

      <p
        class="rounded-lg border border-teal-800/15 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-950"
        data-test="goal-formula"
      >
        Protein is 2 g/kg, sugar and fat are both 1 g/kg. Their calories are reserved first;
        carbohydrates fill the calories remaining in the 90–100% target range.
      </p>

      <section
        class="min-w-0 rounded-lg border border-stone-900/10 bg-white/90 p-4 shadow-xl shadow-stone-900/5 lg:p-5"
        aria-labelledby="daily-food-plan-title"
        data-test="daily-food-plan"
      >
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <p class="mb-2 text-xs font-extrabold tracking-widest text-teal-700 uppercase">
              Quantities in grams
            </p>
            <h2 id="daily-food-plan-title" class="text-2xl font-black">Build your day</h2>
          </div>
          <button
            class="min-h-10 rounded-lg border border-stone-900/15 bg-white px-4 font-black text-stone-900 hover:border-teal-700/45 hover:bg-teal-50"
            data-test="reset-daily-plan"
            type="button"
            (click)="resetPlan()"
          >
            Reset
          </button>
        </div>

        <div class="mb-3 relative w-fit">
          <input
            class="min-h-11 rounded-lg border border-stone-900/20 bg-white px-3 text-base font-extrabold text-stone-900 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15"
            type="search"
            placeholder="Search food..."
            (input)="setSearch($event)"
            [value]="searchSignal()"
          />
          @if (isLoading()) {
            <svg
              class="absolute top-3 right-8 size-5 animate-spin text-teal-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          }
        </div>

        <p class="mb-3 text-sm font-semibold text-stone-500">
          Nutrition reference values shown for every food are per 100 g.
        </p>

        <div class="grid gap-3" role="list" aria-label="Everyday food library">
          @for (product of filteredProducts(); track product.id) {
            <app-daily-food-row
              role="listitem"
              [product]="product"
              [nutrition]="state.nutritionPer100g(product)"
              [quantity]="quantity(product.id)"
              [total]="foodTotal(product)"
              (quantityChange)="setQuantity(product.id, $event)"
              (favoriteClicked)="favoriteClicked(product.id)"
            />
          }
        </div>
      </section>
    </section>
  `,
})
export class DailyNutritionCalculatorComponent {
  protected readonly state = inject(DailyNutritionState);

  protected readonly filteredProducts = this.state.filteredProducts;
  protected readonly calorieTarget = this.state.calorieTarget;
  protected readonly bodyMassKg = this.state.bodyMassKg;
  protected readonly goals = this.state.goals;
  protected readonly totals = this.state.totals;
  protected readonly searchSignal = this.state.searchSignal;
  protected readonly isLoading = this.state.isLoading;

  protected readonly favoriteClicked = this.state.favoriteClicked.bind(this.state);

  protected readonly calorieStatus = computed<NutritionStatus>(() => {
    return this.computeStatus(this.state.calorieStatus());
  });

  protected readonly proteinStatus = computed<NutritionStatus>(() => {
    return this.computeStatus(this.state.proteinStatus());
  });

  protected readonly fatStatus = computed<NutritionStatus>(() => {
    return this.computeStatus(this.state.fatStatus());
  });

  protected readonly carbsStatus = computed<NutritionStatus>(() => {
    return this.computeStatus(this.state.carbsStatus());
  });

  protected readonly sugarStatus = computed<NutritionStatus>(() => {
    return this.computeStatus(this.state.sugarStatus());
  });

  protected readonly goalStatusCards = computed<ReadonlyArray<GoalStatusCard>>(() => {
    const goals = this.goals();
    const totals = this.totals();

    return [
      {
        key: 'protein',
        label: 'Protein',
        goalValue: `${this.format(goals.proteinGrams, 'g', 1)}`,
        currentValue: `${this.format(totals.protein, 'g', 1)}`,
        detail: '(2 g/kg body mass)',
        progress: this.proteinStatus().progress,
        progressDetail: this.proteinStatus().detail,
        progressColor: '[&::-webkit-progress-value]:bg-teal-600',
        textColor: 'text-teal-600',
        color: 'teal-600',
      },
      {
        key: 'fat',
        label: 'Fat',
        goalValue: `${this.format(goals.fatGrams, 'g', 1)}`,
        currentValue: `${this.format(totals.fat, 'g', 1)}`,
        detail: `(1 g/kg body mass)`,
        progress: this.fatStatus().progress,
        progressDetail: this.fatStatus().detail,
        progressColor: '[&::-webkit-progress-value]:bg-amber-600',
        textColor: 'text-amber-600',
        color: 'amber-500',
      },
      {
        key: 'sugar',
        label: 'Sugar',
        goalValue: `${this.format(goals.sugarGrams, 'g', 1)}`,
        currentValue: `${this.format(totals.sugar, 'g', 1)}`,
        detail: `(1 g/kg body mass)`,
        progress: this.sugarStatus().progress,
        progressDetail: this.sugarStatus().detail,
        progressColor: '[&::-webkit-progress-value]:bg-orange-600',
        textColor: 'text-orange-600',
        color: 'orange-500',
      },
      {
        key: 'carbs',
        label: 'Carbohydrates',
        goalValue: this.formatRange(goals.carbohydrateMinimum, goals.carbohydrateMaximum, 'g', 1),
        currentValue: `${this.format(totals.carbs, 'g', 1)}`,
        detail: '(Calories left)',
        progress: this.carbsStatus().progress,
        progressDetail: '',
        progressColor: '[&::-webkit-progress-value]:bg-emerald-600',
        textColor: 'text-emerald-600',
        color: 'emerald-700',
      },
    ];
  });

  protected readonly totalCards = computed<ReadonlyArray<TotalCard>>(() => {
    const totals = this.totals();
    const goals = this.goals();

    return [
      {
        key: 'calories',
        label: 'Calories',
        value: this.format(totals.calories, 'kcal', 0),
        goal: `Goal ${this.formatRange(goals.calorieMinimum, goals.calorieMaximum, 'kcal', 0)}`,
      },
      {
        key: 'carbs',
        label: 'Carbs',
        value: this.format(totals.carbs, 'g', 1),
        goal: `Goal ${this.formatRange(
          goals.carbohydrateMinimum,
          goals.carbohydrateMaximum,
          'g',
          1,
        )}`,
      },
      {
        key: 'protein',
        label: 'Protein',
        value: this.format(totals.protein, 'g', 1),
        goal: `Goal ${this.format(goals.proteinGrams, 'g', 1)}`,
      },
      {
        key: 'fat',
        label: 'Fat',
        value: this.format(totals.fat, 'g', 1),
        goal: `Goal ${this.format(goals.fatGrams, 'g', 1)}`,
      },
      {
        key: 'sugar',
        label: 'Sugar',
        value: this.format(totals.sugar, 'g', 1),
        goal: `Goal ${this.format(goals.sugarGrams, 'g', 1)}`,
      },
      {
        key: 'fiber',
        label: 'Fiber',
        value: this.format(totals.fiber, 'g', 1),
        goal: 'No target set',
      },
    ];
  });

  protected quantity(productId: ProductId): number {
    return this.state.quantity(productId);
  }

  protected setCalorieTarget(event: Event): void {
    this.state.setCalorieTarget(this.inputValue(event));
  }

  protected setBodyMass(event: Event): void {
    this.state.setBodyMass(this.inputValue(event));
  }

  protected setQuantity(productId: ProductId, value: string | number): void {
    this.state.setQuantity(productId, value);
  }

  protected setSearch(event: Event): void {
    this.state.setSearchTerm(this.inputValue(event));
  }

  protected resetPlan(): void {
    this.state.resetPlan();
  }

  protected foodTotal(product: Product): Nutrition {
    return this.state.selectedNutrition(product);
  }

  protected goalCardClasses(toneClass: string): string {
    return `grid min-h-36 content-between gap-3 rounded-lg border border-stone-900/10 bg-white p-4 shadow-sm border-t-4 border-t-${toneClass}`;
  }

  protected calorieStatusClasses = computed(() => {
    const base = 'grid gap-3 rounded-lg border p-4';

    return this.calorieStatus().state === 'under target'
      ? `${base} border-red-500/30 bg-red-50 text-red-800`
      : this.calorieStatus().state === 'over target'
        ? `${base} border-orange-600/30 bg-orange-50 text-orange-800`
        : `${base} border-teal-700/20 bg-teal-50 text-teal-800`;
  });

  protected calorieProgressColor = computed(() =>
    this.calorieStatus().state === 'under target'
      ? `[&::-webkit-progress-value]:bg-red-800`
      : this.calorieStatus().state === 'over target'
        ? `[&::-webkit-progress-value]:bg-orange-800`
        : `[&::-webkit-progress-value]:bg-emerald-800`,
  );

  private inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private formatRange(
    minimum: number,
    maximum: number,
    unit: string,
    maximumFractionDigits: number,
  ): string {
    const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits });

    return `${formatter.format(minimum)}–${formatter.format(maximum)} ${unit}`;
  }

  private computeStatus(status: DailyNutritionStatus): NutritionStatus {
    const suffix =
      status.state === 'under target'
        ? 'to the target range'
        : status.state === 'over target'
          ? 'above target'
          : 'available in the range';

    return {
      ...status,
      detail: `${this.format(status.toBoundary, 'kcal', 0)} ${suffix}`,
    };
  }

  protected format(value: number, unit: string, maximumFractionDigits: number): string {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value)} ${unit}`;
  }
}
