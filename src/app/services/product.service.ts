import { computed, Injectable, signal } from '@angular/core';
import { Nutrition, Product, ProductQuantities } from './product.model';

export const EMPTY_NUTRITION: Nutrition = Object.freeze({
  calories: 0,
  carbs: 0,
  sugar: 0,
  fiber: 0,
  fat: 0,
  protein: 0,
  sodium: 0,
  caffeine: 0,
  salt: 0,
  potassium: 0,
  magnesium: 0,
  calcium: 0,
});

const PRODUCTS: ReadonlyArray<Product> = Object.freeze([
  {
    id: 'maurten-gel-100-caf-100',
    brand: 'Maurten',
    name: 'Gel 100 Caf 100',
    isForRace: true,
    kind: 'gel',
    serving: '1 sachet, 40 g',
    servingGrams: 40,
    sourceLabel: 'Maurten',
    sourceUrl: 'https://www.maurten.com/products/us/gel-100-caf-100-box-us',
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 100,
      carbs: 25,
      sugar: 25,
      salt: 0.055,
      sodium: 22,
      caffeine: 100,
    },
  },
  {
    id: 'maurten-gel-160',
    brand: 'Maurten',
    name: 'Gel 160',
    isForRace: true,
    kind: 'gel',
    serving: '1 sachet, 65 g',
    servingGrams: 65,
    sourceLabel: 'Maurten',
    sourceUrl: 'https://www.maurten.com/products/gb/gel-160',
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
    id: 'maurten-drink-mix-320-caf-100',
    brand: 'Maurten',
    name: 'Drink Mix 320 Caf 100',
    isForRace: true,
    kind: 'drink',
    serving: '1 sachet in 500 ml, 83 g',
    servingGrams: 83,
    sourceLabel: 'Maurten',
    sourceUrl: 'https://www.maurten.com/products/us/drink-mix-320-caf-100-us',
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 320,
      carbs: 80,
      sugar: 37,
      salt: 0.63,
      sodium: 250,
      caffeine: 100,
    },
  },
  {
    id: 'maurten-solid-160',
    brand: 'Maurten',
    name: 'Solid 160',
    isForRace: true,
    kind: 'solid',
    serving: '1 bar, 55 g',
    servingGrams: 55,
    sourceLabel: 'Maurten',
    sourceUrl: 'https://www.maurten.com/products/mt/solid-160',
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 199,
      carbs: 40,
      sugar: 17.5,
      fiber: 1.4,
      fat: 3.1,
      protein: 2.2,
      salt: 0.62,
      sodium: 244,
    },
  },
  {
    id: 'maurten-solid-c-160',
    brand: 'Maurten',
    name: 'Solid C 160',
    isForRace: true,
    kind: 'solid',
    serving: '1 bar, 55 g',
    servingGrams: 55,
    sourceLabel: 'Maurten',
    sourceUrl: 'https://www.maurten.com/products/cz/solid-c-160',
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 204,
      carbs: 40,
      sugar: 19.4,
      fiber: 2.2,
      fat: 3.2,
      protein: 2.6,
      salt: 0.62,
      sodium: 244,
    },
  },
  {
    id: 'baouw-puree-raspberry-strawberry-basil',
    brand: 'Baouw',
    name: 'Energy Purée Raspberry Strawberry Basil',
    isForRace: true,
    kind: 'puree',
    serving: '1 purée, 90 g',
    servingGrams: 90,
    sourceLabel: 'Baouw',
    sourceUrl:
      'https://www.baouw-organic-nutrition.com/en_GB/shop/energy-puree-bio-raspberry-strawberry-basil-891',
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 62,
      carbs: 11,
      sugar: 9.3,
      fiber: 0.3,
      fat: 1.8,
      protein: 0.3,
      salt: 0.03,
      sodium: 1,
      potassium: 150,
      magnesium: 18,
      calcium: 36,
    },
  },
  {
    id: 'baouw-electrolytes-blackberry',
    brand: 'Baouw',
    name: 'Electrolytes Blackberry Blackcurrant',
    isForRace: true,
    kind: 'electrolyte',
    serving: '1 tablet in 500 ml, 5 g',
    servingGrams: 5,
    sourceLabel: 'Baouw',
    sourceUrl:
      'https://www.baouw-organic-nutrition.com/en_GB/shop/electrolyte-blackberry-blackcurrant-1238',
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
    id: 'decathlon-fruit-jellies-citrus',
    brand: 'Decathlon',
    name: 'Energy Fruit Jellies Citrus',
    isForRace: true,
    kind: 'jelly',
    serving: '1 bar, 25 g',
    servingGrams: 25,
    sourceLabel: 'Decathlon',
    sourceUrl:
      'https://www.decathlon.co.uk/p/energy-fruit-jelly-ecosize-12x25g-citrus/311136/g4m8562277',
    nutritionPerServing: {
      ...EMPTY_NUTRITION,
      calories: 84,
      carbs: 21,
      sugar: 16,
      fat: 0.5,
      protein: 0.5,
      salt: 0.06,
      sodium: 24,
    },
  },
  {
    id: 'rolled-oats',
    name: 'Rolled oats',
    isForRace: false,
    kind: 'cereal',
    servingSuggestion: 'Typical dry portion: 40–80 g',
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
    isForRace: true,
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
    id: 'white-rice-cooked',
    name: 'White rice, cooked',
    isForRace: false,
    kind: 'cereal',
    servingSuggestion: 'Typical cooked portion: 150–250 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 130,
      carbs: 28.2,
      sugar: 0.1,
      fiber: 0.4,
      fat: 0.3,
      protein: 2.7,
    },
  },
  {
    id: 'chicken-breast-cooked',
    name: 'Chicken breast, cooked',
    isForRace: false,
    kind: 'meat',
    servingSuggestion: 'Typical cooked portion: 120–200 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 165,
      fat: 3.6,
      protein: 31,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      sodium: 0,
      caffeine: 0,
      salt: 0,
      potassium: 0,
      magnesium: 0,
      calcium: 0,
    },
  },
  {
    id: 'egg-whole',
    name: 'Whole egg',
    isForRace: false,
    kind: 'meat',
    servingSuggestion: 'One medium egg without shell: about 50 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 138,
      carbs: 0.7,
      sugar: 0.4,
      fat: 9.6,
      protein: 13,
    },
  },
  {
    id: 'chocolate-dark-85',
    name: 'Chocolate, dark 85%',
    isForRace: false,
    kind: 'solid',
    servingSuggestion: 'Typical cooked portion: 20g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 588,
      carbs: 20,
      sugar: 15,
      fiber: 19,
      fat: 48,
      protein: 10,
      salt: 0.14,
    },
  },
  {
    id: 'salmon-cooked',
    name: 'Salmon, cooked',
    isForRace: false,
    kind: 'seafood',
    servingSuggestion: 'Typical cooked portion: 120–180 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 206,
      fat: 12.4,
      protein: 22.1,
    },
  },
  {
    id: 'greek-yogurt-zero-fat',
    name: 'Greek yogurt, 0% fat',
    isForRace: false,
    kind: 'dairy',
    servingSuggestion: 'One bowl: about 150–200 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 59,
      carbs: 3.6,
      sugar: 3.2,
      fat: 0.4,
      protein: 10.3,
    },
  },
  {
    id: 'almond-milk',
    name: 'Almond milk biorg',
    isForRace: false,
    kind: 'dairy',
    servingSuggestion: 'One glass: about 200 ml',
    // it's 100ml, not 100g
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 29,
      carbs: 4.6,
      sugar: 3.3,
      fat: 1.2,
      protein: 0.5,
      salt: 0.06,
    },
  },
  {
    id: 'agave-syrup',
    name: 'Agave syrup',
    isForRace: false,
    kind: 'sugar',
    servingSuggestion: 'Typical serving: 1 tablespoon, about 21 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 320,
      carbs: 80,
      sugar: 79,
    },
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    isForRace: false,
    kind: 'fat',
    servingSuggestion: 'One tablespoon: about 14 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 828,
      fat: 92,
    },
  },
  {
    id: 'almonds',
    name: 'Almonds',
    isForRace: false,
    kind: 'nuts',
    servingSuggestion: 'One small handful: about 30 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 579,
      carbs: 21.6,
      sugar: 4.4,
      fiber: 12.5,
      fat: 49.9,
      protein: 21.2,
    },
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    isForRace: false,
    kind: 'vegetable',
    servingSuggestion: 'Typical cooked portion: 100–200 g',
    nutritionPer100g: {
      ...EMPTY_NUTRITION,
      calories: 34,
      carbs: 6.6,
      sugar: 1.7,
      fiber: 2.6,
      fat: 0.4,
      protein: 2.8,
    },
  },
]);

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly catalog = signal(PRODUCTS);

  readonly allProducts = this.catalog.asReadonly();
  readonly dailyProducts = computed<ReadonlyArray<Product>>(() =>
    this.allProducts().filter((product) => !product.isForRace),
  );
  readonly raceProducts = computed<ReadonlyArray<Product>>(() =>
    this.allProducts().filter((product) => product.isForRace),
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
