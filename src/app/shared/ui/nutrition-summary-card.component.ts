import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-nutrition-summary-card',
  standalone: true,
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

  protected cardClasses(): string {
    const base =
      'grid min-h-28 content-between gap-3 rounded-lg border border-stone-900/10 bg-white p-4 shadow-sm border-t-4';
    const classes: Record<string, string> = {
      amber: `${base} border-t-amber-500`,
      blue: `${base} border-t-blue-600`,
      charcoal: `${base} border-t-stone-900`,
      green: `${base} border-t-emerald-700`,
      lime: `${base} border-t-lime-600`,
      orange: `${base} border-t-orange-500`,
      rose: `${base} border-t-rose-600`,
      teal: `${base} border-t-teal-600`,
    };

    return classes[this.tone()] ?? classes['green'];
  }
}
