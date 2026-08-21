import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TargetStatus, TargetStatusCardComponent } from './target-status-card.component';

describe('TargetStatusCardComponent', () => {
  let fixture: ComponentFixture<TargetStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetStatusCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetStatusCardComponent);
    fixture.componentRef.setInput('state', 'under target');
    fixture.componentRef.setInput('currentLabel', '120 g');
    fixture.componentRef.setInput('goalLabel', '240 g');
    fixture.componentRef.setInput('detailLabel', '120 g remaining');
    fixture.componentRef.setInput('progress', 50);
    fixture.componentRef.setInput('progressLabel', 'Carbohydrate target progress');
    fixture.componentRef.setInput('dataTest', 'carb-target');
    fixture.detectChanges();
  });

  it('renders calculator-specific labels and test selectors', () => {
    const card = fixture.nativeElement.querySelector('[data-test="carb-target"]') as HTMLElement;
    const progress = card.querySelector('progress');

    expect(card.textContent).toContain('under target');
    expect(card.textContent).toContain('120 g / 240 g');
    expect(card.textContent).toContain('120 g remaining');
    expect(progress?.getAttribute('value')).toBe('50');
    expect(progress?.getAttribute('aria-label')).toBe('Carbohydrate target progress');
  });

  it.each([
    ['under target', 'border-red-500/30', 'text-red-800'],
    ['over target', 'border-orange-500/30', 'text-orange-800'],
    ['on target', 'border-emerald-700/20', 'text-emerald-800'],
  ] satisfies ReadonlyArray<readonly [TargetStatus, string, string]>)(
    'derives the %s appearance from the status input',
    (state, panelClass, textClass) => {
      fixture.componentRef.setInput('state', state);
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('[data-test="carb-target"]') as HTMLElement;
      const stateLabel = card.querySelector('span');

      expect(card.classList.contains(panelClass)).toBe(true);
      expect(stateLabel?.classList.contains(textClass)).toBe(true);
    },
  );
});
