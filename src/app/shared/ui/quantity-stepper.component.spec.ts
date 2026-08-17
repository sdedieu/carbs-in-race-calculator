import { TestBed } from '@angular/core/testing';
import { getButtonByName, getInputByLabel, setInputValue } from '../../testing/dom-testing';
import { QuantityStepperComponent } from './quantity-stepper.component';

describe('QuantityStepperComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityStepperComponent],
    }).compileComponents();
  });

  it('accepts button and typed quantity changes', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    const valueChange = vi.spyOn(fixture.componentInstance.valueChange, 'emit');
    fixture.componentRef.setInput('label', 'Gel 160');
    fixture.componentRef.setInput('value', 2);
    fixture.detectChanges();

    getButtonByName(fixture.nativeElement, 'Increase Gel 160').click();
    getButtonByName(fixture.nativeElement, 'Reduce Gel 160').click();
    setInputValue(getInputByLabel(fixture.nativeElement, 'Gel 160 quantity'), '2.5');

    expect(valueChange).toHaveBeenNthCalledWith(1, 3);
    expect(valueChange).toHaveBeenNthCalledWith(2, 1);
    expect(valueChange).toHaveBeenNthCalledWith(3, '2.5');
  });
});
