import { computed, inject, Service, signal } from '@angular/core';
import { Nutrition, Product, ProductId, ProductQuantities } from '../../../services/product.model';
import { EMPTY_NUTRITION, ProductService } from '../../../services/product.service';

export interface RaceCarbTarget {
  readonly delta: number;
  readonly goal: number;
  readonly progress: number;
  readonly state: 'on target' | 'over target' | 'under target';
}

@Service()
export class RaceFuelState {
  private readonly productService = inject(ProductService);

  private readonly raceHoursSignal = signal(3);
  private readonly raceMinutesSignal = signal(30);
  private readonly targetCarbsPerHourSignal = signal(80);
  private readonly quantitiesSignal = signal<ProductQuantities>(
    this.productService.createEmptyQuantities(this.productService.raceProducts()),
  );

  readonly products = computed(() => this.productService.raceProducts());
  readonly raceHours = computed(() => this.raceHoursSignal());
  readonly raceMinutes = computed(() => this.raceMinutesSignal());
  readonly targetCarbsPerHour = computed(() => this.targetCarbsPerHourSignal());

  readonly durationHours = computed(() => {
    return Math.max(0, this.raceHours() + this.raceMinutes() / 60);
  });

  readonly totals = computed<Nutrition>(() => {
    return this.products().reduce(
      (total, product) => this.addNutrition(total, this.selectedNutrition(product)),
      { ...EMPTY_NUTRITION },
    );
  });

  readonly perHour = computed<Nutrition>(() => {
    const duration = this.durationHours();

    if (duration === 0) {
      return { ...EMPTY_NUTRITION };
    }

    return this.scaleNutrition(this.totals(), 1 / duration);
  });

  readonly carbTarget = computed<RaceCarbTarget>(() => {
    const goal = this.targetCarbsPerHour() * this.durationHours();
    const total = this.totals().carbs;
    const delta = total - goal;
    const progress = goal > 0 ? Math.min(100, (total / goal) * 100) : 0;
    const state = Math.abs(delta) <= 10 ? 'on target' : delta > 0 ? 'over target' : 'under target';

    return { delta, goal, progress, state };
  });

  quantity(productId: ProductId): number {
    return this.quantitiesSignal()[productId] ?? 0;
  }

  selectedNutrition(product: Product): Nutrition {
    return this.productService.calculateNutritionForRaceServings(
      product,
      this.quantity(product.id),
    );
  }

  nutritionPerServing(product: Product): Nutrition {
    return this.productService.calculateNutritionForRaceServings(product, 1);
  }

  setRaceHours(value: string | number): void {
    this.raceHoursSignal.set(this.clampNumber(value, 0, 99));
  }

  setRaceMinutes(value: string | number): void {
    this.raceMinutesSignal.set(this.clampNumber(value, 0, 59));
  }

  setTargetCarbsPerHour(value: string | number): void {
    this.targetCarbsPerHourSignal.set(this.clampNumber(value, 0, 200));
  }

  setQuantity(productId: ProductId, value: string | number): void {
    const quantity = this.roundToQuarter(this.clampNumber(value, 0, 99));

    this.quantitiesSignal.update((quantities) => ({
      ...quantities,
      [productId]: quantity,
    }));
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

  private scaleNutrition(nutrition: Nutrition, multiplier: number): Nutrition {
    return {
      calories: nutrition.calories * multiplier,
      carbs: nutrition.carbs * multiplier,
      sugar: nutrition.sugar * multiplier,
      fiber: nutrition.fiber * multiplier,
      fat: nutrition.fat * multiplier,
      protein: nutrition.protein * multiplier,
      sodium: nutrition.sodium * multiplier,
      caffeine: nutrition.caffeine * multiplier,
      salt: nutrition.salt * multiplier,
      potassium: nutrition.potassium * multiplier,
      magnesium: nutrition.magnesium * multiplier,
      calcium: nutrition.calcium * multiplier,
    };
  }

  private clampNumber(value: string | number, minimum: number, maximum: number): number {
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value);

    if (Number.isNaN(parsed)) {
      return minimum;
    }

    return Math.min(maximum, Math.max(minimum, parsed));
  }

  private roundToQuarter(value: number): number {
    return Math.round(value * 4) / 4;
  }
}
