export type ProductId =
  | 'maurten-gel-100-caf-100'
  | 'maurten-gel-160'
  | 'maurten-drink-mix-320-caf-100'
  | 'nduranz-energy-unit-drink-90'
  | 'iso-isotonic-short-duration-rasbery'
  | 'maurten-solid-160'
  | 'maurten-solid-c-160'
  | 'baouw-puree-raspberry-strawberry-basil'
  | 'baouw-electrolytes-blackberry'
  | 'decathlon-fruit-jellies-citrus'
  | 'rolled-oats'
  | 'banana'
  | 'plantain-banana'
  | 'melon'
  | 'watermelon'
  | 'salad-letuce'
  | 'white-rice-cooked'
  | 'pasta-cooked'
  | 'gnocchi-cooked'
  | 'fajitas-complete-meal'
  | 'galette-bretonne'
  | 'rice-flour'
  | 'coco-flour'
  | 'coco-sugar'
  | 'grated-comte'
  | 'chicken-breast-cooked'
  | 'ham'
  | 'egg-whole'
  | 'chocolate-dark-85'
  | 'salmon-cooked'
  | 'greek-yogurt-zero-fat'
  | 'chocolate-mouse-veggie'
  | 'rice-pudding-veggie'
  | 'almond-milk'
  | 'agave-syrup'
  | 'peanut-butter'
  | 'hazelnut-butter'
  | 'lentils-cooked'
  | 'olive-oil'
  | 'balsamic-vinegar'
  | 'st-moret'
  | 'morilles-sauce'
  | 'almonds'
  | 'coco-cream'
  | 'light-semi-thick-cream'
  | 'ratatouille'
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
  | 'sauce'
  | 'seafood'
  | 'solid'
  | 'sugar'
  | 'vegetable'
  | 'fish';

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
  readonly type: 'daily' | 'race' | 'both';
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
