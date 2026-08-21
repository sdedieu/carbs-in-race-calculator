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

    setInputValue(getInputByLabel(page, 'BMR (kcal)'), '3000');
    setInputValue(getInputByLabel(page, 'Body mass (kg)'), '80');
    fixture.detectChanges();

    expect(normalizedText(page.querySelector('[data-test="daily-calorie-status"]')!)).toContain(
      '0 kcal / 2,700 kcal',
    );
    expect(normalizedText(page.querySelector('[data-test="protein-goal"]')!)).toContain(
      'Protein 0 g / 160 g',
    );
    expect(normalizedText(page.querySelector('[data-test="fat-goal"]')!)).toContain(
      'Fat 0 g / 80 g',
    );
    expect(normalizedText(page.querySelector('[data-test="carbs-goal"]')!)).toContain(
      'Carbohydrates 0 g / 335–410 g',
    );
  });

  it('tracks a day of food and reports its calorie-target status', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;

    setInputValue(getInputByLabel(page, 'Rolled oats amount in grams'), '100');
    setInputValue(getInputByLabel(page, 'Banana amount in grams'), '200');
    setInputValue(getInputByLabel(page, 'Olive oil amount in grams'), '160');
    fixture.detectChanges();

    const calorieStatus = page.querySelector('[data-test="daily-calorie-status"]');
    const carbohydrateStatus = page.querySelector('[data-test="carbs-goal"]');
    const proteinStatus = page.querySelector('[data-test="protein-goal"]');

    expect(calorieStatus).not.toBeNull();
    expect(normalizedText(calorieStatus!)).toContain('on target 1,892 kcal / 1,890 kcal');
    expect(normalizedText(carbohydrateStatus!)).toContain('Carbohydrates 111.9 g');
    expect(normalizedText(proteinStatus!)).toContain('Protein 19.1 g');

    setInputValue(getInputByLabel(page, 'Olive oil amount in grams'), '300');
    fixture.detectChanges();

    expect(normalizedText(calorieStatus!)).toContain('over target');
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
    expect(normalizedText(page.querySelector('[data-test="daily-calorie-status"]')!)).toContain(
      'under target 0 kcal / 1,890 kcal',
    );
  });

  it('lets a user add and remove a food from favorites', () => {
    const fixture = TestBed.createComponent(DailyNutritionCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    const favoriteBanana = getButtonByName(page, 'Favorite Banana');

    expect(favoriteBanana.getAttribute('aria-pressed')).toBe('false');

    favoriteBanana.click();
    fixture.detectChanges();
    expect(favoriteBanana.getAttribute('aria-pressed')).toBe('true');

    favoriteBanana.click();
    fixture.detectChanges();
    expect(favoriteBanana.getAttribute('aria-pressed')).toBe('false');
  });
});
