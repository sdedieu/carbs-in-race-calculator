import { TestBed } from '@angular/core/testing';
import { QuantityStepperComponent } from './quantity-stepper.component';

describe('QuantityStepperComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityStepperComponent],
    }).compileComponents();
  });

  it('should emit step changes', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    const component = fixture.componentInstance;
    const valueChange = vi.spyOn(component.valueChange, 'emit');

    fixture.componentRef.setInput('label', 'Gel 160');
    fixture.componentRef.setInput('value', 2);
    fixture.detectChanges();

    component['increase']();
    component['decrease']();

    expect(valueChange).toHaveBeenCalledWith(2.5);
    expect(valueChange).toHaveBeenCalledWith(1.5);
  });

  it('should emit typed values', () => {
    const fixture = TestBed.createComponent(QuantityStepperComponent);
    const component = fixture.componentInstance;
    const valueChange = vi.spyOn(component.valueChange, 'emit');

    fixture.componentRef.setInput('label', 'Gel 160');
    fixture.componentRef.setInput('value', 2);
    fixture.detectChanges();

    component['emitValue']('3');

    expect(valueChange).toHaveBeenCalledWith('3');
  });
});
