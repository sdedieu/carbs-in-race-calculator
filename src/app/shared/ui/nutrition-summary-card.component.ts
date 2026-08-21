import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const BASE_CARD_CLASSES =
  'grid min-h-28 content-between gap-3 rounded-lg border border-stone-900/10 bg-white p-4 shadow-sm border-t-4';

const CARD_CLASSES: Record<string, string> = {
  amber: `${BASE_CARD_CLASSES} border-t-amber-500`,
  blue: `${BASE_CARD_CLASSES} border-t-blue-600`,
  charcoal: `${BASE_CARD_CLASSES} border-t-stone-900`,
  green: `${BASE_CARD_CLASSES} border-t-emerald-700`,
  lime: `${BASE_CARD_CLASSES} border-t-lime-600`,
  orange: `${BASE_CARD_CLASSES} border-t-orange-500`,
  rose: `${BASE_CARD_CLASSES} border-t-rose-600`,
  teal: `${BASE_CARD_CLASSES} border-t-teal-600`,
};

@Component({
  selector: 'app-nutrition-summary-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article [class]="cardClasses()" data-test="summary-card">
      <span class="text-xs font-extrabold text-stone-500 uppercase">{{ label() }}</span>
      <strong class="text-2xl leading-none font-black">{{ value() }}</strong>
      <small class="font-bold text-stone-500">{{ perHour() }}</small>
    </article>
  `,
})
export class NutritionSummaryCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly perHour = input.required<string>();
  readonly tone = input.required<string>();

  protected readonly cardClasses = computed(
    () => CARD_CLASSES[this.tone()] ?? CARD_CLASSES['green'],
  );
}
