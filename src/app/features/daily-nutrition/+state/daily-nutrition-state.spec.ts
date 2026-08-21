import { TestBed } from '@angular/core/testing';
import { ProductService } from '../../../services/product.service';
import {
  ProductServiceStub,
  provideProductServiceStub,
} from '../../../testing/product-service.stub';
import { DailyNutritionState } from './daily-nutrition-state';

describe('DailyNutritionState', () => {
  let state: DailyNutritionState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailyNutritionState, provideProductServiceStub()],
    });
    state = TestBed.inject(DailyNutritionState);
  });

  it('derives its products from the unified catalog', () => {
    expect(state.products()).toHaveLength(3);
    expect(state.products().find((product) => product.id === 'banana')?.type).toBe('both');
    expect(state.products().some((product) => product.type === 'race')).toBe(false);
  });

  it('derives calorie and macro goals from the private source state', () => {
    expect(state.goals()).toMatchObject({
      calorieMaximum: 2100,
      calorieMinimum: 1890,
      carbohydrateMaximum: 202,
      carbohydrateMinimum: 149.5,
      fatGrams: 76,
      proteinGrams: 152,
    });

    state.setCalorieTarget(3000);
    state.setBodyMass(80);

    expect(state.goals()).toMatchObject({
      calorieMinimum: 2700,
      calorieMaximum: 3000,
      proteinGrams: 160,
      fatGrams: 80,
      carbohydrateMinimum: 335,
      carbohydrateMaximum: 410,
    });
  });

  it('updates totals and target status through quantity actions', () => {
    state.setQuantity('rolled-oats', 100);
    state.setQuantity('banana', 200);

    expect(state.totals()).toMatchObject({
      calories: 567,
      carbs: 111.9,
      fiber: 15.8,
      fat: 7.5,
    });
    expect(state.totals().sugar).toBeCloseTo(25.3);
    expect(state.totals().protein).toBeCloseTo(19.1);
    expect(state.calorieStatus().state).toBe('under target');

    state.setQuantity('olive-oil', 160);
    expect(state.calorieStatus().state).toBe('on target');

    state.setQuantity('olive-oil', 300);
    expect(state.calorieStatus().state).toBe('over target');
  });

  it('resets selected product quantities', () => {
    state.setQuantity('banana', 120);
    state.resetPlan();

    expect(state.quantity('banana')).toBe(0);
    expect(state.totals()).toEqual({
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
  });

  it('adds a non-favorite product to favorites', async () => {
    const productService = TestBed.inject(ProductService) as unknown as ProductServiceStub;
    const addAsFavorite = vi.spyOn(productService, 'addAsFavorite');

    await state.favoriteClicked('banana');

    expect(addAsFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'banana', isFavorite: false }),
    );
    expect(state.products().find((product) => product.id === 'banana')?.isFavorite).toBe(true);
  });

  it('removes a favorite product from favorites', async () => {
    const productService = TestBed.inject(ProductService) as unknown as ProductServiceStub;
    const removeAsFavorite = vi.spyOn(productService, 'removeAsFavorite');

    await state.favoriteClicked('rolled-oats');

    expect(removeAsFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'rolled-oats', isFavorite: true }),
    );
    expect(state.products().find((product) => product.id === 'rolled-oats')?.isFavorite).toBe(
      false,
    );
  });
});
