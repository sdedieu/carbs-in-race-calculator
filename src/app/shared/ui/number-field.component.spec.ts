import { TestBed } from '@angular/core/testing';
import { getInputByLabel, setInputValue } from '../../testing/dom-testing';
import { NumberFieldComponent } from './number-field.component';

describe('NumberFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFieldComponent],
    }).compileComponents();
  });

  it('accepts a value through its labelled number input', () => {
    const fixture = TestBed.createComponent(NumberFieldComponent);
    const valueChange = vi.spyOn(fixture.componentInstance.valueChange, 'emit');
    fixture.componentRef.setInput('label', 'Hours');
    fixture.componentRef.setInput('value', 3);
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 24);
    fixture.detectChanges();

    const input = getInputByLabel(fixture.nativeElement, 'Hours');

    expect(input.value).toBe('3');
    expect(input.min).toBe('0');
    expect(input.max).toBe('24');

    setInputValue(input, '4');

    expect(valueChange).toHaveBeenCalledOnce();
    expect(valueChange).toHaveBeenCalledWith('4');
  });
});
