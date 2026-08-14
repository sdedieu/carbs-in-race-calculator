import { TestBed } from '@angular/core/testing';
import { Nutrition, Product } from '../../services/product.model';
import { ProductLibraryCardComponent } from './product-library-card.component';

const NUTRITION: Nutrition = {
  calories: 11,
  carbs: 1.5,
  sugar: 0.03,
  fiber: 0.019,
  fat: 0,
  protein: 0.006,
  sodium: 300,
  caffeine: 0,
  salt: 0.759,
  potassium: 300,
  magnesium: 56.25,
  calcium: 50,
};

const PRODUCT: Product = {
  id: 'baouw-electrolytes-blackberry',
  brand: 'Baouw',
  name: 'Electrolytes Blackberry Blackcurrant',
  type: 'race',
  kind: 'electrolyte',
  serving: '1 tablet in 500 ml, 5 g',
  sourceLabel: 'Baouw',
  sourceUrl:
    'https://www.baouw-organic-nutrition.com/en_GB/shop/electrolyte-blackberry-blackcurrant-1238',
  nutritionPerServing: NUTRITION,
};

describe('ProductLibraryCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLibraryCardComponent],
    }).compileComponents();
  });

  it('should render product nutrition and micronutrients', () => {
    const fixture = TestBed.createComponent(ProductLibraryCardComponent);
    fixture.componentRef.setInput('product', PRODUCT);
    fixture.componentRef.setInput('nutrition', NUTRITION);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Electrolytes Blackberry Blackcurrant');
    expect(compiled.textContent).toContain('1.5 g');
    expect(compiled.textContent).toContain('300 mg sodium');
    expect(compiled.textContent).toContain('56.3 mg magnesium');
  });
});
