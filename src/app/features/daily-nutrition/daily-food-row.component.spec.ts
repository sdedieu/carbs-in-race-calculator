import { TestBed } from '@angular/core/testing';
import { Nutrition, Product } from '../../services/product.model';
import {
  getButtonByName,
  getInputByLabel,
  normalizedText,
  setInputValue,
} from '../../testing/dom-testing';
import { DailyFoodRowComponent } from './daily-food-row.component';

const NUTRITION: Nutrition = {
  calories: 89,
  carbs: 22.8,
  sugar: 12.2,
  fiber: 2.6,
  fat: 0.3,
  protein: 1.1,
  sodium: 0,
  caffeine: 0,
  salt: 0,
  potassium: 0,
  magnesium: 0,
  calcium: 0,
};

const PRODUCT: Product = {
  id: 'banana',
  name: 'Banana',
  isFavorite: false,
  type: 'both',
  kind: 'fruit',
  servingSuggestion: 'One medium peeled banana: about 120 g',
  nutritionPer100g: NUTRITION,
};

const TOTAL: Nutrition = {
  calories: 178,
  carbs: 45.6,
  sugar: 24.4,
  fiber: 5.2,
  fat: 0.6,
  protein: 2.2,
  sodium: 0,
  caffeine: 0,
  salt: 0,
  potassium: 0,
  magnesium: 0,
  calcium: 0,
};

describe('DailyFoodRowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFoodRowComponent],
    }).compileComponents();
  });

  it('renders per-100g nutrition and the selected amount total', () => {
    const fixture = TestBed.createComponent(DailyFoodRowComponent);
    fixture.componentRef.setInput('product', PRODUCT);
    fixture.componentRef.setInput('nutrition', NUTRITION);
    fixture.componentRef.setInput('quantity', 200);
    fixture.componentRef.setInput('total', TOTAL);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(normalizedText(compiled)).toContain('Banana');
    expect(normalizedText(compiled)).toContain('Energy 89 kcal');
    expect(normalizedText(compiled)).toContain('Amount total 178 kcal');
  });

  it('emits typed gram quantities', () => {
    const fixture = TestBed.createComponent(DailyFoodRowComponent);
    const quantityChange = vi.spyOn(fixture.componentInstance.quantityChange, 'emit');
    fixture.componentRef.setInput('product', PRODUCT);
    fixture.componentRef.setInput('nutrition', NUTRITION);
    fixture.componentRef.setInput('quantity', 0);
    fixture.componentRef.setInput('total', TOTAL);
    fixture.detectChanges();

    const input = getInputByLabel(fixture.nativeElement, 'Banana amount in grams');
    setInputValue(input, '125');

    expect(quantityChange).toHaveBeenCalledWith('125');
  });

  it('exposes and emits favorite toggle requests', () => {
    const fixture = TestBed.createComponent(DailyFoodRowComponent);
    const favoriteClicked = vi.spyOn(fixture.componentInstance.favoriteClicked, 'emit');
    fixture.componentRef.setInput('product', PRODUCT);
    fixture.componentRef.setInput('nutrition', NUTRITION);
    fixture.componentRef.setInput('quantity', 0);
    fixture.componentRef.setInput('total', TOTAL);
    fixture.detectChanges();

    const favoriteButton = getButtonByName(fixture.nativeElement, 'Favorite Banana');

    expect(favoriteButton.getAttribute('aria-pressed')).toBe('false');
    favoriteButton.click();
    expect(favoriteClicked).toHaveBeenCalledOnce();

    fixture.componentRef.setInput('product', { ...PRODUCT, isFavorite: true });
    fixture.detectChanges();

    expect(favoriteButton.getAttribute('aria-pressed')).toBe('true');
  });
});
