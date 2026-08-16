import { computed, inject, Service, signal } from '@angular/core';
import { Nutrition, Product, ProductId, ProductQuantities } from '../../../services/product.model';
import { EMPTY_NUTRITION, ProductService } from '../../../services/product.service';

export interface DailyNutritionGoals {
  readonly calorieMinimum: number;
  readonly calorieMaximum: number;
  readonly proteinGrams: number;
  readonly fatGrams: number;
  readonly sugarGrams: number;
  readonly carbohydrateMinimum: number;
  readonly carbohydrateMaximum: number;
  readonly proteinCalories: number;
  readonly fatCalories: number;
}

export interface DailyCalorieStatus {
  readonly state: 'under target' | 'on target' | 'over target';
  readonly caloriesToBoundary: number;
  readonly progress: number;
}

@Service()
export class DailyNutritionState {
  private readonly productService = inject(ProductService);

  private readonly calorieTargetSignal = signal(2_100);
  private readonly bodyMassKgSignal = signal(76);
  private readonly quantitiesSignal = signal<ProductQuantities>(
    this.productService.createEmptyQuantities(this.productService.dailyProducts()),
  );
  readonly searchSignal = signal('');

  readonly products = computed(() => this.productService.dailyProducts());
  readonly filteredProducts = computed(() => {
    const searchTerm = this.searchSignal().toLowerCase();

    if (!searchTerm) {
      return this.products();
    }

    return this.products().filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.kind?.toLowerCase().includes(searchTerm),
    );
  });
  readonly calorieTarget = computed(() => this.calorieTargetSignal());
  readonly bodyMassKg = computed(() => this.bodyMassKgSignal());

  readonly goals = computed<DailyNutritionGoals>(() => {
    const calorieMaximum = this.calorieTarget();
    const calorieMinimum = calorieMaximum * 0.9;
    const proteinGrams = this.bodyMassKg() * 2;
    const fatGrams = this.bodyMassKg();
    const sugarGrams = this.bodyMassKg();
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const reservedCalories = proteinCalories + fatCalories;

    return {
      calorieMinimum,
      calorieMaximum,
      proteinGrams,
      fatGrams,
      sugarGrams,
      carbohydrateMinimum: Math.max(0, (calorieMinimum - reservedCalories) / 4),
      carbohydrateMaximum: Math.max(0, (calorieMaximum - reservedCalories) / 4),
      proteinCalories,
      fatCalories,
    };
  });

  readonly totals = computed<Nutrition>(() => {
    return this.products().reduce(
      (total, product) => this.addNutrition(total, this.selectedNutrition(product)),
      { ...EMPTY_NUTRITION },
    );
  });

  readonly calorieStatus = computed<DailyCalorieStatus>(() => {
    const calories = this.totals().calories;
    const goals = this.goals();
    const progress =
      goals.calorieMaximum > 0 ? Math.min(100, (calories / goals.calorieMaximum) * 100) : 0;

    if (calories < goals.calorieMinimum) {
      return {
        state: 'under target',
        caloriesToBoundary: goals.calorieMinimum - calories,
        progress,
      };
    }

    if (calories > goals.calorieMaximum) {
      return {
        state: 'over target',
        caloriesToBoundary: calories - goals.calorieMaximum,
        progress,
      };
    }

    return {
      state: 'on target',
      caloriesToBoundary: goals.calorieMaximum - calories,
      progress,
    };
  });

  quantity(productId: ProductId): number {
    return this.quantitiesSignal()[productId] ?? 0;
  }

  nutritionPer100g(product: Product): Nutrition {
    return this.productService.calculateNutritionForGrams(product, 100);
  }

  selectedNutrition(product: Product): Nutrition {
    return this.productService.calculateNutritionForGrams(product, this.quantity(product.id));
  }

  setCalorieTarget(value: string | number): void {
    this.calorieTargetSignal.set(this.clampNumber(value, 0, 10000));
  }

  setBodyMass(value: string | number): void {
    this.bodyMassKgSignal.set(this.clampNumber(value, 0, 500));
  }

  setQuantity(productId: ProductId, value: string | number): void {
    const quantity = this.clampNumber(value, 0, 5000);

    this.quantitiesSignal.update((quantities) => ({
      ...quantities,
      [productId]: quantity,
    }));
  }

  setSearchTerm(searchTerm: string): void {
    this.searchSignal.set(searchTerm);
  }

  resetPlan(): void {
    this.quantitiesSignal.set(this.productService.createEmptyQuantities(this.products()));
  }

  private addNutrition(left: Nutrition, right: Nutrition): Nutrition {
    return {
      calories: left.calories + right.calories,
      carbs: left.carbs + right.carbs,
      sugar: left.sugar + right.sugar,
      fiber: left.fiber + right.fiber,
      fat: left.fat + right.fat,
      protein: left.protein + right.protein,
      sodium: left.sodium + right.sodium,
      caffeine: left.caffeine + right.caffeine,
      salt: left.salt + right.salt,
      potassium: left.potassium + right.potassium,
      magnesium: left.magnesium + right.magnesium,
      calcium: left.calcium + right.calcium,
    };
  }

  private clampNumber(value: string | number, minimum: number, maximum: number): number {
    const parsed = typeof value === 'number' ? value : Number(value);
    const normalized = Number.isFinite(parsed) ? parsed : minimum;

    return Math.min(maximum, Math.max(minimum, normalized));
  }
}
