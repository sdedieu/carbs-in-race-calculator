import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TEST_PRODUCTS } from '../testing/product-service.stub';
import { Product } from './product.model';

const firestoreMock = vi.hoisted(() => ({
  collection: vi.fn(),
  collectionData: vi.fn(),
  doc: vi.fn(),
  endAt: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  setDoc: vi.fn(),
  startAt: vi.fn(),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class Firestore {},
  collection: firestoreMock.collection,
  collectionData: firestoreMock.collectionData,
  doc: firestoreMock.doc,
  endAt: firestoreMock.endAt,
  orderBy: firestoreMock.orderBy,
  query: firestoreMock.query,
  setDoc: firestoreMock.setDoc,
  startAt: firestoreMock.startAt,
}));

import { Firestore } from '@angular/fire/firestore';
import { EMPTY_NUTRITION, ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let firestore: object;

  beforeEach(async () => {
    vi.clearAllMocks();
    firestore = {};
    firestoreMock.collection.mockImplementation((_firestore: object, path: string) => ({ path }));
    firestoreMock.collectionData.mockImplementation((reference: { path: string }) =>
      of(reference.path === 'users/me/favorites' ? TEST_PRODUCTS : []),
    );
    firestoreMock.doc.mockImplementation((_firestore: object, path: string) => ({ path }));
    firestoreMock.query.mockImplementation((reference: unknown) => reference);
    firestoreMock.setDoc.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: firestore }],
    });
    service = TestBed.inject(ProductService);
    TestBed.tick();
    await Promise.resolve();
    TestBed.tick();
  });

  it('should expose Firestore products and filter them by daily and race use', () => {
    expect(firestoreMock.collection).toHaveBeenCalledWith(firestore, 'users/me/favorites');
    expect(service.allProducts()).toEqual(TEST_PRODUCTS);
    expect(service.dailyProducts()).toHaveLength(3);
    expect(service.raceProducts()).toHaveLength(3);
    expect(service.dailyProducts().every((product) => product.type !== 'race')).toBe(true);
    expect(service.raceProducts().every((product) => product.type !== 'daily')).toBe(true);
  });

  it('should expose banana as the same both-use product in both filters', () => {
    const allBanana = findProduct(service.allProducts(), 'banana');
    const dailyBanana = findProduct(service.dailyProducts(), 'banana');
    const raceBanana = findProduct(service.raceProducts(), 'banana');

    expect(allBanana.type).toBe('both');
    expect(dailyBanana).toBe(allBanana);
    expect(raceBanana).toBe(allBanana);
  });

  it('should preserve Maurten race-serving nutrition totals', () => {
    const gel = findProduct(service.raceProducts(), 'maurten-gel-160');
    const nutrition = service.calculateNutritionForRaceServings(gel, 2);

    expect(nutrition.calories).toBe(320);
    expect(nutrition.carbs).toBe(80);
    expect(nutrition.sugar).toBe(80);
    expect(nutrition.sodium).toBe(64);
    expect(nutrition.salt).toBeCloseTo(0.16);
    expect(nutrition.caffeine).toBe(0);
  });

  it('should preserve rolled oats per-100g nutrition and scale gram amounts', () => {
    const oats = findProduct(service.dailyProducts(), 'rolled-oats');

    expect(service.calculateNutritionForGrams(oats, 100)).toEqual({
      ...EMPTY_NUTRITION,
      calories: 389,
      carbs: 66.3,
      sugar: 0.9,
      fiber: 10.6,
      fat: 6.9,
      protein: 16.9,
    });
    expect(service.calculateNutritionForGrams(oats, 50).calories).toBe(194.5);
    expect(service.calculateNutritionForGrams(oats, 50).protein).toBe(8.45);
  });

  it('should calculate gram nutrition from serving data for race-only products', () => {
    const gel = findProduct(service.raceProducts(), 'maurten-gel-160');

    expect(service.calculateNutritionForGrams(gel, 65)).toEqual(gel.nutritionPerServing);
    expect(service.calculateNutritionForGrams(gel, 32.5).carbs).toBe(20);
  });

  it('should calculate a race serving from per-100g data for banana', () => {
    const banana = findProduct(service.raceProducts(), 'banana');
    const nutrition = service.calculateNutritionForRaceServings(banana, 1);

    expect(nutrition.calories).toBeCloseTo(106.8);
    expect(nutrition.carbs).toBeCloseTo(27.36);
    expect(nutrition.protein).toBeCloseTo(1.32);
  });

  it('should create empty quantity records for all or filtered products', () => {
    const allQuantities = service.createEmptyQuantities();
    const raceQuantities = service.createEmptyQuantities(service.raceProducts());

    expect(Object.keys(allQuantities)).toHaveLength(5);
    expect(Object.values(allQuantities).every((quantity) => quantity === 0)).toBe(true);
    expect(Object.keys(raceQuantities)).toHaveLength(3);
    expect(raceQuantities['banana']).toBe(0);
    expect(raceQuantities['rolled-oats']).toBeUndefined();
  });

  it('should treat negative and non-finite amounts as zero', () => {
    const oats = findProduct(service.dailyProducts(), 'rolled-oats');

    expect(service.calculateNutritionForGrams(oats, -50)).toEqual(EMPTY_NUTRITION);
    expect(service.calculateNutritionForRaceServings(oats, Number.NaN)).toEqual(EMPTY_NUTRITION);
  });

  it('should persist favorite products without their document ids', async () => {
    const gel = findProduct(TEST_PRODUCTS, 'maurten-gel-160');
    const { id: _id, ...gelData } = gel;

    await service.setProducts([gel]);

    expect(firestoreMock.doc).toHaveBeenCalledWith(firestore, 'users/me/favorites/maurten-gel-160');
    expect(firestoreMock.setDoc).toHaveBeenCalledWith(
      { path: 'users/me/favorites/maurten-gel-160' },
      gelData,
    );
  });
});

function findProduct(products: ReadonlyArray<Product>, id: Product['id']): Product {
  const product = products.find((candidate) => candidate.id === id);

  if (!product) {
    throw new Error(`Expected product ${id}`);
  }

  return product;
}
