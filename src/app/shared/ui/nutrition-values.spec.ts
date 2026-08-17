import { TestBed } from '@angular/core/testing';
import { Nutrition } from '../../services/product.model';
import { normalizedText } from '../../testing/dom-testing';
import { NutritionValuesComponent } from './nutrition-values';

const NUTRITION: Nutrition = {
  calories: 1234.6,
  carbs: 22.84,
  sugar: 12.24,
  fiber: 2.66,
  fat: 0.34,
  protein: 1.14,
  sodium: 32,
  caffeine: 0,
  salt: 0.08,
  potassium: 0,
  magnesium: 0,
  calcium: 0,
};

describe('NutritionValuesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionValuesComponent],
    }).compileComponents();
  });

  it('renders the six displayed nutrition values with their units and rounding', () => {
    const fixture = TestBed.createComponent(NutritionValuesComponent);
    fixture.componentRef.setInput('nutrition', NUTRITION);
    fixture.detectChanges();

    const content = normalizedText(fixture.nativeElement);

    expect(content).toContain('Energy 1,235 kcal');
    expect(content).toContain('Carbs 22.8 g');
    expect(content).toContain('Sugar 12.2 g');
    expect(content).toContain('Fiber 2.7 g');
    expect(content).toContain('Fat 0.3 g');
    expect(content).toContain('Protein 1.1 g');
  });

  it('updates rendered values when the nutrition input changes', () => {
    const fixture = TestBed.createComponent(NutritionValuesComponent);
    fixture.componentRef.setInput('nutrition', NUTRITION);
    fixture.detectChanges();

    fixture.componentRef.setInput('nutrition', {
      ...NUTRITION,
      calories: 89,
      carbs: 22.8,
    });
    fixture.detectChanges();

    const content = normalizedText(fixture.nativeElement);

    expect(content).toContain('Energy 89 kcal');
    expect(content).toContain('Carbs 22.8 g');
    expect(content).not.toContain('1,235 kcal');
  });
});
