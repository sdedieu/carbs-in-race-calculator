import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-carb-target-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="panelClasses()" data-test="carb-target">
      <div class="flex items-end justify-between gap-4">
        <span [class]="stateClasses()">{{ state() }}</span>
        <strong class="text-lg whitespace-nowrap">{{ currentLabel() }} / {{ goalLabel() }}</strong>
      </div>
      <progress
        class="h-2 w-full overflow-hidden rounded-full accent-emerald-700"
        [class.accent-orange-600]="state() === 'over target'"
        [value]="progress()"
        max="100"
        aria-label="Carbohydrate target progress"
      ></progress>
      <small class="font-bold text-stone-600">{{ deltaLabel() }}</small>
    </div>
  `,
})
export class CarbTargetPanelComponent {
  readonly state = input.required<string>();
  readonly currentLabel = input.required<string>();
  readonly goalLabel = input.required<string>();
  readonly delta = input.required<number>();
  readonly deltaLabel = input.required<string>();
  readonly progress = input.required<number>();

  protected panelClasses(): string {
    const base = 'grid gap-3 rounded-lg border p-4';

    return this.state() === 'under target'
      ? `${base} border-red-500/30 bg-red-50 text-red-800`
      : this.state() === 'over target'
        ? `${base} border-orange-500/30 bg-orange-50`
        : `${base} border-emerald-700/20 bg-emerald-50`;
  }

  protected stateClasses(): string {
    const base = 'text-xs font-black tracking-wide uppercase';

    return this.state() === 'under target'
      ? `${base} text-red-700`
      : this.state() === 'over target'
        ? `${base} text-orange-700`
        : `${base} text-emerald-700`;
  }
}
