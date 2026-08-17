import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DailyNutritionCalculatorComponent } from './features/daily-nutrition/daily-nutrition-calculator.component';
import { RaceFuelCalculatorComponent } from './features/race-fuel/race-fuel-calculator.component';

type CalculatorMode = 'race' | 'daily';

@Component({
  selector: 'app-root',
  imports: [DailyNutritionCalculatorComponent, RaceFuelCalculatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      class="min-h-screen bg-[#f6f8f3] bg-gradient-to-br from-emerald-800/10 via-[#f6f8f3] to-orange-500/10 px-4 py-4 text-stone-900 sm:px-7 sm:py-7"
      data-test="nutrition-calculators"
    >
      <div class="mx-auto grid w-full max-w-[1440px] gap-5">
        <header
          class="flex flex-col gap-4 rounded-lg border border-stone-900/10 bg-stone-950 px-4 py-4 text-white shadow-xl shadow-stone-900/10 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          data-test="calculator-navigation"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-lg font-black text-stone-950"
              aria-hidden="true"
            >
              F
            </span>
            <div>
              <p class="text-base font-black">Fuel & nutrition</p>
              <p class="text-xs font-semibold text-stone-400">Plan for race day and every day</p>
            </div>
          </div>

          <nav
            class="grid grid-cols-2 rounded-lg bg-white/10 p-1"
            aria-label="Calculator mode"
            data-test="calculator-mode"
          >
            <button
              [class]="modeButtonClasses('race')"
              type="button"
              data-test="show-race-calculator"
              [attr.aria-pressed]="activeCalculator() === 'race'"
              (click)="selectCalculator('race')"
            >
              Race fuel
            </button>
            <button
              [class]="modeButtonClasses('daily')"
              type="button"
              data-test="show-daily-calculator"
              [attr.aria-pressed]="activeCalculator() === 'daily'"
              (click)="selectCalculator('daily')"
            >
              Everyday nutrition
            </button>
          </nav>
        </header>

        @switch (activeCalculator()) {
          @case ('race') {
            <app-race-fuel-calculator />
          }
          @case ('daily') {
            <app-daily-nutrition-calculator />
          }
        }
      </div>
    </main>
  `,
})
export class App {
  protected readonly activeCalculator = signal<CalculatorMode>('race');

  protected selectCalculator(mode: CalculatorMode): void {
    this.activeCalculator.set(mode);
  }

  protected modeButtonClasses(mode: CalculatorMode): string {
    const base = 'min-h-10 rounded-md px-3 text-sm font-black transition-colors sm:px-5';

    return this.activeCalculator() === mode
      ? `${base} bg-white text-stone-950 shadow-sm`
      : `${base} text-stone-300 hover:bg-white/10 hover:text-white`;
  }
}
