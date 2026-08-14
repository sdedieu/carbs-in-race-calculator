import { TestBed } from '@angular/core/testing';
import { RaceFuelCalculatorComponent } from './race-fuel-calculator.component';

describe('RaceFuelCalculatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceFuelCalculatorComponent],
    }).compileComponents();
  });

  it('renders the existing race calculator', () => {
    const fixture = TestBed.createComponent(RaceFuelCalculatorComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Race fuel calculator');
    expect(compiled.querySelector('[data-test="race-settings"]')).toBeTruthy();
    expect(compiled.querySelector('[data-test="fuel-plan"]')).toBeTruthy();
  });

  it('calculates totals from selected quantities', () => {
    const fixture = TestBed.createComponent(RaceFuelCalculatorComponent);
    const calculator = fixture.componentInstance as RaceFuelCalculatorComponent & {
      setQuantity(productId: string, value: number): void;
      totals(): { calories: number; carbs: number; sugar: number };
    };

    calculator.setQuantity('maurten-gel-160', 2);
    calculator.setQuantity('baouw-electrolytes-blackberry', 1);

    expect(calculator.totals().carbs).toBe(81.5);
    expect(calculator.totals().calories).toBe(331);
    expect(calculator.totals().sugar).toBe(80.03);
  });
});
