import { TestBed } from '@angular/core/testing';
import { RaceFuelState } from './race-fuel-state';

describe('RaceFuelState', () => {
  let state: RaceFuelState;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RaceFuelState] });
    state = TestBed.inject(RaceFuelState);
  });

  it('derives its products from the unified catalog', () => {
    expect(state.products()).toHaveLength(9);
    expect(state.products().find((product) => product.id === 'banana')?.type).toBe('both');
    expect(state.products().some((product) => product.type === 'daily')).toBe(false);
  });

  it('derives duration and carbohydrate targets from race settings', () => {
    expect(state.durationHours()).toBe(3.5);
    expect(state.carbTarget()).toMatchObject({
      goal: 280,
      delta: -280,
      state: 'under target',
    });

    state.setRaceHours(4);
    state.setRaceMinutes(15);
    state.setTargetCarbsPerHour(90);

    expect(state.durationHours()).toBe(4.25);
    expect(state.carbTarget().goal).toBe(382.5);
  });

  it('updates serving quantities and totals through actions', () => {
    state.setQuantity('maurten-gel-160', 2);
    state.setQuantity('baouw-electrolytes-blackberry', 1);

    expect(state.totals().carbs).toBe(81.5);
    expect(state.totals().calories).toBe(331);
    expect(state.totals().sugar).toBe(80.03);
  });

  it('supports products shared with daily nutrition', () => {
    state.setQuantity('banana', 1);

    expect(state.totals().calories).toBeCloseTo(106.8);
    expect(state.totals().carbs).toBeCloseTo(27.36);
  });

  it('resets selected serving quantities', () => {
    state.setQuantity('maurten-gel-160', 2);
    state.resetPlan();

    expect(state.quantity('maurten-gel-160')).toBe(0);
    expect(state.totals().calories).toBe(0);
  });
});
