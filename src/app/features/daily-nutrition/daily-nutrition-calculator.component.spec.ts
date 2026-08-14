import { TestBed } from '@angular/core/testing';
import { DailyNutritionCalculatorComponent } from './daily-nutrition-calculator.component';

function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('DailyNutritionCalculatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyNutritionCalculatorComponent],
    }).compileComponents();
  });

  it('should derive calorie and macro goals from target calories and body mass', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-test="calories-goal"]')?.textContent).toContain(
      'Acceptable calories1,800–2,000 kcal',
    );
    expect(compiled.querySelector('[data-test="protein-goal"]')?.textContent).toContain(
      'Protein goal152 g',
    );
    expect(compiled.querySelector('[data-test="fat-goal"]')?.textContent).toContain('Fat goal76 g');
    expect(compiled.querySelector('[data-test="carbs-goal"]')?.textContent).toContain('127–177 g');
  });

  it('should update all goals from their source inputs', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const calorieInput = compiled.querySelector<HTMLInputElement>(
      '[data-test="calorie-target-input"]',
    );
    const bodyMassInput = compiled.querySelector<HTMLInputElement>('[data-test="body-mass-input"]');

    expect(calorieInput).not.toBeNull();
    expect(bodyMassInput).not.toBeNull();
    setInputValue(calorieInput!, '3000');
    setInputValue(bodyMassInput!, '80');
    fixture.detectChanges();

    expect(compiled.querySelector('[data-test="calories-goal"]')?.textContent).toContain(
      '2,700–3,000 kcal',
    );
    expect(compiled.querySelector('[data-test="protein-goal"]')?.textContent).toContain('160 g');
    expect(compiled.querySelector('[data-test="fat-goal"]')?.textContent).toContain('80 g');
    expect(compiled.querySelector('[data-test="carbs-goal"]')?.textContent).toContain('335–410 g');
  });

  it('should total calories, carbs, sugar, fiber, fat, and protein from gram amounts', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const oatsInput = compiled.querySelector<HTMLInputElement>(
      '[data-food-id="rolled-oats"] [data-test="food-quantity-input"]',
    );
    const bananaInput = compiled.querySelector<HTMLInputElement>(
      '[data-food-id="banana"] [data-test="food-quantity-input"]',
    );

    expect(oatsInput).not.toBeNull();
    expect(bananaInput).not.toBeNull();
    setInputValue(oatsInput!, '100');
    setInputValue(bananaInput!, '200');
    fixture.detectChanges();

    expect(compiled.querySelector('[data-metric="calories"]')?.textContent).toContain('567 kcal');
    expect(compiled.querySelector('[data-metric="carbs"]')?.textContent).toContain('111.9 g');
    expect(compiled.querySelector('[data-metric="sugar"]')?.textContent).toContain('25.3 g');
    expect(compiled.querySelector('[data-metric="fiber"]')?.textContent).toContain('15.8 g');
    expect(compiled.querySelector('[data-metric="fat"]')?.textContent).toContain('7.5 g');
    expect(compiled.querySelector('[data-metric="protein"]')?.textContent).toContain('19.1 g');
  });

  it('should report whether selected foods are inside the calorie target range', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    const calculator = fixture.componentInstance as DailyNutritionCalculatorComponent & {
      setQuantity(foodId: 'olive-oil', value: number): void;
      calorieStatus(): { state: string };
    };

    calculator.setQuantity('olive-oil', 260);
    expect(calculator.calorieStatus().state).toBe('over target');

    calculator.setQuantity('olive-oil', 300);
    expect(calculator.calorieStatus()).toMatchObject({
      state: 'over target',
    });
  });

  it('should reset every selected food amount', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const oatsInput = compiled.querySelector<HTMLInputElement>(
      '[data-food-id="rolled-oats"] [data-test="food-quantity-input"]',
    );
    const resetButton = compiled.querySelector<HTMLButtonElement>('[data-test="reset-daily-plan"]');

    expect(oatsInput).not.toBeNull();
    expect(resetButton).not.toBeNull();
    setInputValue(oatsInput!, '100');
    fixture.detectChanges();
    resetButton!.click();
    fixture.detectChanges();

    expect(oatsInput?.value).toBe('0');
    expect(compiled.querySelector('[data-metric="calories"]')?.textContent).toContain('0 kcal');
  });
});
