import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the race calculator by default', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Race fuel calculator');
    expect(compiled.querySelector('[data-test="race-fuel-calculator"]')).toBeTruthy();
    expect(compiled.querySelector('[data-test="daily-nutrition-calculator"]')).toBeFalsy();
  });

  it('switches to the everyday nutrition calculator', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dailyButton = compiled.querySelector<HTMLButtonElement>(
      '[data-test="show-daily-calculator"]',
    );

    dailyButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-test="race-fuel-calculator"]')).toBeFalsy();
    expect(compiled.querySelector('[data-test="daily-nutrition-calculator"]')).toBeTruthy();
    expect(dailyButton?.getAttribute('aria-pressed')).toBe('true');
  });
});
