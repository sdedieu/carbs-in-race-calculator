export type ProductId =
  | 'maurten-gel-100-caf-100'
  | 'maurten-gel-160'
  | 'maurten-drink-mix-320-caf-100'
  | 'maurten-solid-160'
  | 'maurten-solid-c-160'
  | 'baouw-puree-raspberry-strawberry-basil'
  | 'baouw-electrolytes-blackberry'
  | 'decathlon-fruit-jellies-citrus'
  | 'rolled-oats'
  | 'banana'
  | 'white-rice-cooked'
  | 'chicken-breast-cooked'
  | 'egg-whole'
  | 'chocolate-dark-85'
  | 'salmon-cooked'
  | 'greek-yogurt-zero-fat'
  | 'almond-milk'
  | 'agave-syrup'
  | 'lentils-cooked'
  | 'olive-oil'
  | 'almonds'
  | 'broccoli';

export type ProductKind =
  | 'cereal'
  | 'dairy'
  | 'drink'
  | 'electrolyte'
  | 'fat'
  | 'fruit'
  | 'gel'
  | 'jelly'
  | 'legume'
  | 'meat'
  | 'nuts'
  | 'puree'
  | 'seafood'
  | 'solid'
  | 'sugar'
  | 'vegetable';

export interface Nutrition {
  readonly calories: number;
  readonly carbs: number;
  readonly sugar: number;
  readonly fiber: number;
  readonly fat: number;
  readonly protein: number;
  readonly sodium: number;
  readonly caffeine: number;
  readonly salt: number;
  readonly potassium: number;
  readonly magnesium: number;
  readonly calcium: number;
}

export interface Product {
  readonly id: ProductId;
  readonly name: string;
  readonly isForRace: boolean;
  readonly kind: ProductKind;
  readonly brand?: string;
  readonly serving?: string;
  readonly servingGrams?: number;
  readonly servingSuggestion?: string;
  readonly sourceLabel?: string;
  readonly sourceUrl?: string;
  readonly nutritionPerServing?: Nutrition;
  readonly nutritionPer100g?: Nutrition;
}

export type ProductQuantities = Partial<Record<ProductId, number>>;
