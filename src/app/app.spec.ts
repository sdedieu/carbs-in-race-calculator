import { TestBed } from '@angular/core/testing';
import {
  getButtonByName,
  getInputByLabel,
  normalizedText,
  setInputValue,
} from './testing/dom-testing';
import { provideProductServiceStub } from './testing/product-service.stub';
import { App } from './app';

describe('Fuel and nutrition application', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideProductServiceStub()],
    }).compileComponents();
  });

  it('lets a user move between calculators without losing their settings', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;

    expect(normalizedText(page)).toContain('Race fuel calculator');
    setInputValue(getInputByLabel(page, 'Hours'), '4');
    fixture.detectChanges();

    getButtonByName(page, 'Everyday nutrition').click();
    fixture.detectChanges();

    expect(normalizedText(page)).toContain('Daily fuel calculator');
    setInputValue(getInputByLabel(page, 'BMR (kcal)'), '3000');
    fixture.detectChanges();
    expect(normalizedText(page)).toContain('0 kcal / 2,700 kcal');

    getButtonByName(page, 'Race fuel').click();
    fixture.detectChanges();
    expect(getInputByLabel(page, 'Hours').value).toBe('4');

    getButtonByName(page, 'Everyday nutrition').click();
    fixture.detectChanges();
    expect(getInputByLabel(page, 'BMR (kcal)').value).toBe('3000');
  });
});
