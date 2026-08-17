import { TestBed } from '@angular/core/testing';
import { Product } from '../../services/product.model';
import { FuelPlanRowComponent } from './fuel-plan-row.component';

const PRODUCT: Product = {
  id: 'maurten-gel-160',
  brand: 'Maurten',
  name: 'Gel 160',
  type: 'race',
  kind: 'gel',
  serving: '1 sachet, 65 g',
  sourceLabel: 'Maurten',
  sourceUrl: 'https://www.maurten.com/products/gb/gel-160',
  nutritionPerServing: {
    calories: 160,
    carbs: 40,
    sugar: 40,
    fiber: 0,
    fat: 0,
    protein: 0,
    sodium: 32,
    caffeine: 0,
    salt: 0.08,
    potassium: 0,
    magnesium: 0,
    calcium: 0,
  },
};

describe('FuelPlanRowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelPlanRowComponent],
    }).compileComponents();
  });

  it('should render product and totals', () => {
    const fixture = TestBed.createComponent(FuelPlanRowComponent);
    fixture.componentRef.setInput('product', PRODUCT);
    fixture.componentRef.setInput('quantity', 2);
    fixture.componentRef.setInput('total', {
      ...PRODUCT.nutritionPerServing,
      calories: 320,
      carbs: 80,
      sugar: 80,
      sodium: 64,
      salt: 0.16,
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Gel 160');
    expect(compiled.textContent).toContain('80 g');
    expect(compiled.textContent).toContain('320 kcal');
  });

  it('should forward quantity changes', () => {
    const fixture = TestBed.createComponent(FuelPlanRowComponent);
    const component = fixture.componentInstance;
    const quantityChange = vi.spyOn(component.quantityChange, 'emit');

    fixture.componentRef.setInput('product', PRODUCT);
    fixture.componentRef.setInput('quantity', 2);
    fixture.componentRef.setInput('total', PRODUCT.nutritionPerServing);
    fixture.detectChanges();

    component['emitQuantity'](2.5);

    expect(quantityChange).toHaveBeenCalledWith(2.5);
  });
});
