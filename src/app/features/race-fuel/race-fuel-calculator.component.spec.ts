import { TestBed } from '@angular/core/testing';
import {
  getButtonByName,
  getInputByLabel,
  normalizedText,
  setInputValue,
} from '../../testing/dom-testing';
import { provideProductServiceStub } from '../../testing/product-service.stub';
import { RaceFuelCalculatorComponent } from './race-fuel-calculator.component';

describe('Race fuel calculator', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceFuelCalculatorComponent],
      providers: [provideProductServiceStub()],
    }).compileComponents();
  });

  it('helps an athlete configure a race and build a fuel plan', () => {
    const fixture = TestBed.createComponent(RaceFuelCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;

    expect(normalizedText(page)).toContain('Race fuel calculator');

    setInputValue(getInputByLabel(page, 'Hours'), '4');
    setInputValue(getInputByLabel(page, 'Minutes'), '15');
    setInputValue(getInputByLabel(page, 'Carbs / h'), '90');
    fixture.detectChanges();

    expect(normalizedText(page)).toContain('0 g / 383 g');
    expect(normalizedText(page)).toContain('382.5 g remaining');

    setInputValue(getInputByLabel(page, 'Gel 160 quantity'), '2');
    setInputValue(getInputByLabel(page, 'Electrolytes Blackberry Blackcurrant quantity'), '1');
    fixture.detectChanges();

    const totals = page.querySelector('[aria-label="Nutrition totals"]');

    expect(totals).not.toBeNull();
    expect(normalizedText(totals!)).toContain('Carbs 81.5 g');
    expect(normalizedText(totals!)).toContain('Calories 331 kcal');
    expect(normalizedText(totals!)).toContain('Sugar 80 g');
    expect(normalizedText(page)).toContain('301 g remaining');
  });

  it('lets an athlete reset the complete fuel plan', () => {
    const fixture = TestBed.createComponent(RaceFuelCalculatorComponent);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    const gelQuantity = getInputByLabel(page, 'Gel 160 quantity');

    setInputValue(gelQuantity, '2');
    fixture.detectChanges();
    expect(normalizedText(page.querySelector('[aria-label="Nutrition totals"]')!)).toContain(
      '320 kcal',
    );

    getButtonByName(page, 'Reset').click();
    fixture.detectChanges();

    expect(gelQuantity.value).toBe('0');
    expect(normalizedText(page.querySelector('[aria-label="Nutrition totals"]')!)).toContain(
      'Calories 0 kcal',
    );
  });
});
