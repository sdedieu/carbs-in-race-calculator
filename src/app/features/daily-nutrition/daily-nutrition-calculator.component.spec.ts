import { TestBed } from '@angular/core/testing';
import {
  getButtonByName,
  getInputByLabel,
  normalizedText,
  setInputValue,
} from '../../testing/dom-testing';
import { provideProductServiceStub } from '../../testing/product-service.stub';
import { DailyNutritionCalculatorComponent } from './daily-nutrition-calculator.component';

describe('Daily nutrition calculator', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyNutritionCalculatorComponent],
      providers: [provideProductServiceStub()],
    }).compileComponents();
  });

  it('turns calorie and body-mass preferences into daily macro goals', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;

    setInputValue(getInputByLabel(page, 'Calorie target'), '3000');
    setInputValue(getInputByLabel(page, 'Body mass (kg)'), '80');
    fixture.detectChanges();

    expect(normalizedText(page)).toContain('Acceptable calories 2,700–3,000 kcal');
    expect(normalizedText(page)).toContain('Protein goal 160 g');
    expect(normalizedText(page)).toContain('Fat goal 80 g');
    expect(normalizedText(page)).toContain('Carbohydrate goal 335–410 g');
  });

  it('tracks a day of food and reports its calorie-target status', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;

    setInputValue(getInputByLabel(page, 'Rolled oats amount in grams'), '100');
    setInputValue(getInputByLabel(page, 'Banana amount in grams'), '200');
    setInputValue(getInputByLabel(page, 'Olive oil amount in grams'), '160');
    fixture.detectChanges();

    const totals = page.querySelector('[aria-label="Selected food nutrition totals"]');

    expect(totals).not.toBeNull();
    expect(normalizedText(totals!)).toContain('Calories 1,892 kcal');
    expect(normalizedText(totals!)).toContain('Carbs 111.9 g');
    expect(normalizedText(totals!)).toContain('Protein 19.1 g');
    expect(normalizedText(page)).toContain('on target');

    setInputValue(getInputByLabel(page, 'Olive oil amount in grams'), '300');
    fixture.detectChanges();

    expect(normalizedText(page)).toContain('over target');
  });

  it('lets a user clear all selected food amounts', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    const oatsAmount = getInputByLabel(page, 'Rolled oats amount in grams');

    setInputValue(oatsAmount, '100');
    fixture.detectChanges();
    getButtonByName(page, 'Reset').click();
    fixture.detectChanges();

    expect(oatsAmount.value).toBe('0');
    expect(
      normalizedText(page.querySelector('[aria-label="Selected food nutrition totals"]')!),
    ).toContain('Calories 0 kcal');
  });
});
