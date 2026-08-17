import { computed, Provider, signal } from '@angular/core';
import { Nutrition, Product, ProductQuantities } from '../services/product.model';
import { EMPTY_NUTRITION, ProductService } from '../services/product.service';

export const TEST_PRODUCTS: ReadonlyArray<Product> = [
  {
    id: 'maurten-gel-160',
    brand: 'Maurten',
    name: 'Gel 160',
    isFavorite: true,
    type: 'race',
    kind: 'gel',
    serving: '1 sachet, 65 g',
    servingGrams: 65,
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 160,
      carbs: 40,
      sugar: 40,
      salt: 0.08,
      sodium: 32,
    },
  },
  {
    id: 'baouw-electrolytes-blackberry',
    brand: 'Baouw',
    name: 'Electrolytes Blackberry Blackcurrant',
    isFavorite: true,
    type: 'race',
    kind: 'electrolyte',
    serving: '1 tablet in 500 ml, 5 g',
    servingGrams: 5,
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 11,
      carbs: 1.5,
      sugar: 0.03,
      fiber: 0.019,
      protein: 0.006,
      salt: 0.759,
      sodium: 300,
      potassium: 300,
      magnesium: 56.25,
      calcium: 50,
    },
  },
  {
    id: 'rolled-oats',
    name: 'Rolled oats',
    isFavorite: true,
    type: 'daily',
    kind: 'cereal',
    servingSuggestion: 'Typical dry portion: 40-80 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 389,
      carbs: 66.3,
      sugar: 0.9,
      fiber: 10.6,
      fat: 6.9,
      protein: 16.9,
    },
  },
  {
    id: 'banana',
    name: 'Banana',
    isFavorite: true,
    type: 'both',
    kind: 'fruit',
    serving: '1 medium peeled banana, about 120 g',
    servingGrams: 120,
    servingSuggestion: 'One medium peeled banana: about 120 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 89,
      carbs: 22.8,
      sugar: 12.2,
      fiber: 2.6,
      fat: 0.3,
      protein: 1.1,
    },
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    isFavorite: true,
    type: 'daily',
    kind: 'fat',
    servingSuggestion: 'One tablespoon: about 14 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 828,
      fat: 92,
    },
  },
];

export class ProductServiceStub {
  private readonly catalog = signal(TEST_PRODUCTS);

  readonly search = signal('');
  readonly allProducts = this.catalog.asReadonly();
  readonly dailyProducts = computed(() =>
    this.allProducts().filter((product) => product.type === 'daily' || product.type === 'both'),
  );
  readonly raceProducts = computed(() =>
    this.allProducts().filter((product) => product.type === 'race' || product.type === 'both'),
  );

  calculateNutritionForGrams(product: Product, grams: number): Nutrition {
    const normalizedGrams = this.normalizeAmount(grams);

    if (normalizedGrams === 0) {
      return { ...EMPTY_NUTRITION };
    }

    if (product.nutritionPer100g) {
      return this.scaleNutrition(product.nutritionPer100g, normalizedGrams / 100);
    }

    if (product.nutritionPerServing && product.servingGrams) {
      return this.scaleNutrition(
        product.nutritionPerServing,
        normalizedGrams / product.servingGrams,
      );
    }

    throw new Error(`${product.name} does not define gram-based nutrition`);
  }

  calculateNutritionForRaceServings(product: Product, servings: number): Nutrition {
    const normalizedServings = this.normalizeAmount(servings);

    if (normalizedServings === 0) {
      return { ...EMPTY_NUTRITION };
    }

    if (product.nutritionPerServing) {
      return this.scaleNutrition(product.nutritionPerServing, normalizedServings);
    }

    if (product.nutritionPer100g && product.servingGrams) {
      return this.scaleNutrition(
        product.nutritionPer100g,
        (product.servingGrams * normalizedServings) / 100,
      );
    }

    throw new Error(`${product.name} does not define race-serving nutrition`);
  }

  createEmptyQuantities(products: ReadonlyArray<Product> = this.allProducts()): ProductQuantities {
    return Object.fromEntries(products.map((product) => [product.id, 0])) as ProductQuantities;
  }

  private normalizeAmount(amount: number): number {
    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
  }

  private scaleNutrition(nutrition: Nutrition, factor: number): Nutrition {
    return {
      calories: nutrition.calories * factor,
      carbs: nutrition.carbs * factor,
      sugar: nutrition.sugar * factor,
      fiber: nutrition.fiber * factor,
      fat: nutrition.fat * factor,
      protein: nutrition.protein * factor,
      sodium: nutrition.sodium * factor,
      caffeine: nutrition.caffeine * factor,
      salt: nutrition.salt * factor,
      potassium: nutrition.potassium * factor,
      magnesium: nutrition.magnesium * factor,
      calcium: nutrition.calcium * factor,
    };
  }
}

export function provideProductServiceStub(): Provider {
  return { provide: ProductService, useFactory: () => new ProductServiceStub() };
}
