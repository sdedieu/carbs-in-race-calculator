import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TargetStatus = 'under target' | 'on target' | 'over target';

const HOST_BINDINGS = { class: 'block' };

@Component({
  selector: 'app-target-status-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: HOST_BINDINGS,
  template: `
    <div [class]="panelClasses()" [attr.data-test]="dataTest()">
      <div class="flex items-end justify-between gap-4">
        <span [class]="stateClasses()">{{ state() }}</span>
        <strong [class]="'text-lg whitespace-nowrap ' + stateTextColor()">
          {{ currentLabel() }} / {{ goalLabel() }}
        </strong>
      </div>
      <progress
        [class]="progressClasses()"
        [value]="progress()"
        max="100"
        [attr.aria-label]="progressLabel()"
      ></progress>
      <small class="font-bold text-stone-600">{{ detailLabel() }}</small>
    </div>
  `,
})
export class TargetStatusCardComponent {
  readonly state = input.required<TargetStatus>();
  readonly currentLabel = input.required<string>();
  readonly goalLabel = input.required<string>();
  readonly detailLabel = input.required<string>();
  readonly progress = input.required<number>();
  readonly progressLabel = input.required<string>();
  readonly dataTest = input<string>('target-status-card');

  protected readonly panelClasses = computed(() => {
    const base = 'grid gap-3 rounded-lg border p-4';

    return this.state() === 'under target'
      ? `${base} border-red-500/30 bg-red-50`
      : this.state() === 'over target'
        ? `${base} border-orange-500/30 bg-orange-50`
        : `${base} border-emerald-700/20 bg-emerald-50`;
  });

  protected readonly stateTextColor = computed(() => {
    return this.state() === 'under target'
      ? 'text-red-800'
      : this.state() === 'over target'
        ? 'text-orange-800'
        : 'text-emerald-800';
  });

  protected readonly stateClasses = computed(
    () => `text-xs font-black tracking-wide uppercase ${this.stateTextColor()}`,
  );

  protected readonly progressClasses = computed(() => {
    const base =
      'h-2 w-full overflow-hidden rounded-full accent-emerald-700 [&::-webkit-progress-bar]:bg-gray-200';

    return this.state() === 'under target'
      ? `${base} [&::-webkit-progress-value]:bg-red-800`
      : this.state() === 'over target'
        ? `${base} [&::-webkit-progress-value]:bg-orange-800`
        : `${base} [&::-webkit-progress-value]:bg-emerald-800`;
  });
}
