import { TestBed } from '@angular/core/testing';
import { Nutrition } from '../../services/product.model';
import { normalizedText } from '../../testing/dom-testing';
import { NutritionTotalAmountsCardComponent } from './nutrition-total-amounts-card.component';

const TOTAL: Nutrition = {
  calories: 330.6,
  carbs: 81.54,
  sugar: 80.03,
  fiber: 5.26,
  fat: 1.24,
  protein: 4.56,
  sodium: 364,
  caffeine: 0,
  salt: 0.84,
  potassium: 300,
  magnesium: 56.25,
  calcium: 50,
};

describe('NutritionTotalAmountsCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionTotalAmountsCardComponent],
    }).compileComponents();
  });

  it('renders rounded calories and the requested nutrition totals in order', () => {
    const fixture = TestBed.createComponent(NutritionTotalAmountsCardComponent);
    fixture.componentRef.setInput('total', TOTAL);
    fixture.componentRef.setInput('nutritionToDisplay', ['carbs', 'protein', 'fat']);
    fixture.detectChanges();

    expect(normalizedText(fixture.nativeElement)).toBe(
      'Amount total 331 kcal 81.5 g carbs · 4.6 g protein · 1.2 g fat',
    );
  });

  it('updates the nutrition label when the requested metrics change', () => {
    const fixture = TestBed.createComponent(NutritionTotalAmountsCardComponent);
    fixture.componentRef.setInput('total', TOTAL);
    fixture.componentRef.setInput('nutritionToDisplay', ['sugar', 'fiber']);
    fixture.detectChanges();

    expect(normalizedText(fixture.nativeElement)).toContain('80 g sugar · 5.3 g fiber');

    fixture.componentRef.setInput('nutritionToDisplay', ['fat']);
    fixture.detectChanges();

    const updatedContent = normalizedText(fixture.nativeElement);

    expect(updatedContent).toContain('1.2 g fat');
    expect(updatedContent).not.toContain('sugar');
  });
});
