import { computed, debounced, effect, inject, Injectable, signal } from '@angular/core';
import { Nutrition, Product, ProductQuantities } from './product.model';
import { EMPTY, map, Observable, of, tap } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  setDoc,
  doc,
  query,
  startAt,
  endAt,
  orderBy,
  deleteDoc,
} from '@angular/fire/firestore';
import { rxResource } from '@angular/core/rxjs-interop';

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

@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  products$: Observable<Product[]> = EMPTY as Observable<Product[]>; // initialize with an empty observable

  readonly search = signal<string>('');
  readonly debouncedSearch = debounced(this.search, 300);
  readonly searchLowerCase = computed(() => this.debouncedSearch.value().toLocaleLowerCase());

  favoritesResource = rxResource({
    stream: () => {
      const favoriteProductsCollection = collection(this.firestore, 'users/me/favorites');
      return (
        collectionData(favoriteProductsCollection, { idField: 'id' }) as Observable<Product[]>
      ).pipe(
        map((products) =>
          products.map((product) => ({
            ...product,
            isFavorite: true,
          })),
        ),
      );
    },
  });

  productsResource = rxResource({
    params: () => ({
      search: this.searchLowerCase(),
    }),
    stream: ({ params: { search } }) => {
      const productsCollection = collection(this.firestore, 'foods');

      const q = query(
        productsCollection,
        orderBy('name'),
        startAt(search),
        endAt(search + '\uf8ff'),
      );

      const products$ = search
        ? (collectionData(q, { idField: 'id' }) as Observable<Product[]>)
        : of([]);

      return products$.pipe(
        map((products: Product[]) =>
          products.map((product) => ({ ...product, isFavorite: false })),
        ),
      );
    },
  });

  readonly allProducts = computed<ReadonlyArray<Product>>(() => {
    const favoritesIds = this.favoritesResource.value()?.map((fav) => fav.id);
    const withoutDuplicateProducts = this.productsResource
      .value()
      ?.filter((product) => !favoritesIds?.includes(product.id));
    return [...(withoutDuplicateProducts ?? []), ...(this.favoritesResource.value() ?? [])].sort(
      (a, b) => a.name.localeCompare(b.name),
    );
  });
  readonly dailyProducts = computed<ReadonlyArray<Product>>(() =>
    this.allProducts().filter((product) => product.type === 'daily' || product.type === 'both'),
  );
  readonly raceProducts = computed<ReadonlyArray<Product>>(() =>
    this.allProducts().filter((product) => product.type === 'race' || product.type === 'both'),
  );

  async setProducts(products: ReadonlyArray<Product>) {
    await Promise.all(
      products.map((product) => {
        const { id, ...productData } = product;
        const ref = doc(this.firestore, `users/me/favorites/${id}`);
        return setDoc(ref, productData);
      }),
    );
  }

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

  addAsFavorite(product: Product): Promise<void> {
    const { id, ...productData } = product;
    return setDoc(doc(this.firestore, `users/me/favorites/${id}`), productData);
  }

  removeAsFavorite({ id }: Product): Promise<void> {
    return deleteDoc(doc(this.firestore, `users/me/favorites/${id}`));
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
