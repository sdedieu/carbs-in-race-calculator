import { TestBed } from '@angular/core/testing';
import { Nutrition } from '../../services/product.model';
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

    const compiled = fixture.nativeElement as HTMLElement;
    const values = Array.from(compiled.querySelectorAll('div')).map((element) => ({
      label: element.querySelector('dt')?.textContent?.trim(),
      value: element.querySelector('dd')?.textContent?.trim(),
    }));

    expect(compiled.getAttribute('data-test')).toBe('per-100g-values');
    expect(values).toEqual([
      { label: 'Energy', value: '1,235 kcal' },
      { label: 'Carbs', value: '22.8 g' },
      { label: 'Sugar', value: '12.2 g' },
      { label: 'Fiber', value: '2.7 g' },
      { label: 'Fat', value: '0.3 g' },
      { label: 'Protein', value: '1.1 g' },
    ]);
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

    expect(fixture.nativeElement.textContent).toContain('89 kcal');
    expect(fixture.nativeElement.textContent).toContain('22.8 g');
    expect(fixture.nativeElement.textContent).not.toContain('1,235 kcal');
  });
});
