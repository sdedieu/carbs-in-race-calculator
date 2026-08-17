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

export interface DailyNutritionStatus {
  readonly state: 'under target' | 'on target' | 'over target';
  readonly toBoundary: number;
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
  readonly searchSignal = this.productService.search;

  readonly products = computed(() => this.productService.dailyProducts());
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

  readonly calorieStatus = computed<DailyNutritionStatus>(() => {
    return this.computeSatus(
      this.totals().calories,
      this.goals().calorieMaximum,
      this.goals().calorieMinimum,
    );
  });

  readonly proteinStatus = computed<DailyNutritionStatus>(() => {
    return this.computeSatus(this.totals().protein, this.goals().proteinGrams);
  });

  readonly fatStatus = computed<DailyNutritionStatus>(() => {
    return this.computeSatus(this.totals().fat, this.goals().fatGrams);
  });

  readonly carbsStatus = computed<DailyNutritionStatus>(() => {
    return this.computeSatus(
      this.totals().carbs,
      this.goals().carbohydrateMaximum,
      this.goals().carbohydrateMinimum,
    );
  });

  readonly sugarStatus = computed<DailyNutritionStatus>(() => {
    return this.computeSatus(this.totals().sugar, this.goals().sugarGrams);
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
    this.productService.search.set(searchTerm);
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

  private computeSatus(value: number, max: number, min?: number): DailyNutritionStatus {
    const progress = max > 0 ? Math.min(100, (value / max) * 100) : 0;

    if (value < (min ?? max)) {
      return {
        state: 'under target',
        toBoundary: (min ?? max) - value,
        progress,
      };
    }

    if (value > max) {
      return {
        state: 'over target',
        toBoundary: value - max,
        progress,
      };
    }

    return {
      state: 'on target',
      toBoundary: max - value,
      progress,
    };
  }
}
