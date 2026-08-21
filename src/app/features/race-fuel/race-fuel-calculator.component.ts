import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Nutrition, Product, ProductId } from '../../services/product.model';
import { NumberFieldComponent } from '../../shared/ui/number-field.component';
import { NutritionSummaryCardComponent } from '../../shared/ui/nutrition-summary-card.component';
import { TargetStatusCardComponent } from '../../shared/ui/target-status-card.component';
import { FuelPlanRowComponent } from './fuel-plan-row.component';
import { RaceFuelState } from './+state/race-fuel-state';

interface TotalCard {
  label: string;
  value: string;
  perHour: string;
  tone: string;
}

const HOST_BINDINGS = { class: 'block' };

@Component({
  selector: 'app-race-fuel-calculator',
  imports: [
    FuelPlanRowComponent,
    NumberFieldComponent,
    NutritionSummaryCardComponent,
    TargetStatusCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: HOST_BINDINGS,
  template: `
    <section class="grid gap-5" data-test="race-fuel-calculator">
      <section
        class="grid items-center gap-6 rounded-lg border border-stone-900/10 bg-white/90 p-4 shadow-xl shadow-stone-900/5 lg:grid-cols-[minmax(240px,1fr)_minmax(300px,470px)_minmax(250px,360px)] lg:p-6"
        aria-labelledby="race-calculator-title"
        data-test="race-settings"
      >
        <div>
          <p class="mb-2 text-xs font-extrabold tracking-widest text-emerald-700 uppercase">
            Race nutrition
          </p>
          <h1
            id="race-calculator-title"
            class="max-w-[540px] text-4xl leading-none font-black tracking-normal text-balance sm:text-6xl lg:text-7xl"
          >
            Race fuel calculator
          </h1>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Race settings">
          <app-number-field
            label="Hours"
            dataTest="race-hours"
            [value]="raceHours()"
            [min]="0"
            [max]="99"
            (valueChange)="setRaceHours($event)"
          />

          <app-number-field
            label="Minutes"
            dataTest="race-minutes"
            [value]="raceMinutes()"
            [min]="0"
            [max]="59"
            (valueChange)="setRaceMinutes($event)"
          />

          <app-number-field
            label="Carbs / h"
            dataTest="target-carbs"
            [value]="targetCarbsPerHour()"
            [min]="0"
            [max]="200"
            (valueChange)="setTargetCarbsPerHour($event)"
          />
        </div>

        <app-target-status-card
          dataTest="carb-target"
          [state]="carbTarget().state"
          [currentLabel]="format(totals().carbs, 'g', 1)"
          [goalLabel]="format(carbTarget().goal, 'g', 0)"
          [detailLabel]="carbTargetDeltaLabel()"
          [progress]="carbTarget().progress"
          progressLabel="Carbohydrate target progress"
        />
      </section>

      <section
        class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
        aria-label="Nutrition totals"
        data-test="nutrition-totals"
      >
        @for (card of totalCards(); track card.label) {
          <app-nutrition-summary-card
            [label]="card.label"
            [value]="card.value"
            [perHour]="card.perHour"
            [tone]="card.tone"
          />
        }
      </section>

      <section class="grid min-w-0 items-start gap-5">
        <section
          class="min-w-0 rounded-lg border border-stone-900/10 bg-white/90 p-4 shadow-xl shadow-stone-900/5 lg:p-5"
          aria-labelledby="planner-title"
          data-test="fuel-plan"
        >
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <p class="mb-2 text-xs font-extrabold tracking-widest text-emerald-700 uppercase">
                Quantities
              </p>
              <h2 id="planner-title" class="text-2xl font-black tracking-normal">Fuel plan</h2>
            </div>
            <button
              class="min-h-10 rounded-lg border border-stone-900/15 bg-white px-4 font-black text-stone-900 hover:border-emerald-700/45 hover:bg-emerald-50"
              data-test="reset-plan"
              type="button"
              (click)="resetPlan()"
            >
              Reset
            </button>
          </div>

          <div
            class="grid min-w-0 gap-2"
            role="table"
            aria-label="Product quantities and calculated totals"
          >
            <div
              class="hidden min-w-0 grid-cols-[minmax(0,1.6fr)_minmax(150px,170px)_repeat(3,minmax(64px,0.55fr))] gap-3 px-3 pb-1 text-xs font-black text-stone-500 uppercase lg:grid"
              role="row"
            >
              <span role="columnheader">Product</span>
              <span role="columnheader">Qty</span>
              <span role="columnheader">Carbs</span>
              <span role="columnheader">Calories</span>
              <span role="columnheader">Sugar</span>
            </div>

            @for (product of products(); track product.id) {
              <app-fuel-plan-row
                [product]="product"
                [quantity]="quantity(product.id)"
                [total]="productTotal(product)"
                (quantityChange)="setQuantity(product.id, $event)"
              />
            }
          </div>
        </section>
      </section>
    </section>
  `,
})
export class RaceFuelCalculatorComponent {
  protected readonly state = inject(RaceFuelState);

  protected readonly products = this.state.products;
  protected readonly raceHours = this.state.raceHours;
  protected readonly raceMinutes = this.state.raceMinutes;
  protected readonly targetCarbsPerHour = this.state.targetCarbsPerHour;
  protected readonly totals = this.state.totals;
  protected readonly perHour = this.state.perHour;
  protected readonly carbTarget = this.state.carbTarget;

  protected readonly totalCards = computed<ReadonlyArray<TotalCard>>(() => {
    const totals = this.totals();
    const perHour = this.perHour();

    return [
      this.card('Carbs', totals.carbs, 'g', perHour.carbs, 'g/h', 'green'),
      this.card('Calories', totals.calories, 'kcal', perHour.calories, 'kcal/h', 'orange'),
      this.card('Sugar', totals.sugar, 'g', perHour.sugar, 'g/h', 'rose'),
      this.card('Sodium', totals.sodium, 'mg', perHour.sodium, 'mg/h', 'blue'),
      this.card('Caffeine', totals.caffeine, 'mg', perHour.caffeine, 'mg/h', 'charcoal'),
      this.card('Fiber', totals.fiber, 'g', perHour.fiber, 'g/h', 'lime'),
      this.card('Fat', totals.fat, 'g', perHour.fat, 'g/h', 'amber'),
      this.card('Protein', totals.protein, 'g', perHour.protein, 'g/h', 'teal'),
    ];
  });

  protected quantity(productId: ProductId): number {
    return this.state.quantity(productId);
  }

  protected setRaceHours(value: string): void {
    this.state.setRaceHours(value);
  }

  protected setRaceMinutes(value: string): void {
    this.state.setRaceMinutes(value);
  }

  protected setTargetCarbsPerHour(value: string): void {
    this.state.setTargetCarbsPerHour(value);
  }

  protected setQuantity(productId: ProductId, value: string | number): void {
    this.state.setQuantity(productId, value);
  }

  protected resetPlan(): void {
    this.state.resetPlan();
  }

  protected productTotal(product: Product): Nutrition {
    return this.state.selectedNutrition(product);
  }

  protected format(value: number, unit = '', maximumFractionDigits = 0): string {
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits,
      minimumFractionDigits: value > 0 && value < 1 ? 1 : 0,
    }).format(value);

    return unit ? `${formatted} ${unit}` : formatted;
  }

  protected carbTargetDeltaLabel(): string {
    const delta = this.carbTarget().delta;

    if (delta >= 0) {
      return `${this.format(delta, 'g', 1)} above target`;
    }

    return `${this.format(delta * -1, 'g', 1)} remaining`;
  }

  private card(
    label: string,
    value: number,
    unit: string,
    perHourValue: number,
    perHourUnit: string,
    tone: string,
  ): TotalCard {
    return {
      label,
      value: this.format(value, unit, unit === 'kcal' || unit === 'mg' ? 0 : 1),
      perHour: this.format(
        perHourValue,
        perHourUnit,
        perHourUnit.includes('kcal') || perHourUnit.includes('mg') ? 0 : 1,
      ),
      tone,
    };
  }
}
