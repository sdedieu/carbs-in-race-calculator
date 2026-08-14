import { TestBed } from '@angular/core/testing';
import { NumberFieldComponent } from './number-field.component';

describe('NumberFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFieldComponent],
    }).compileComponents();
  });

  it('should render the label and value', () => {
    const fixture = TestBed.createComponent(NumberFieldComponent);
    fixture.componentRef.setInput('label', 'Hours');
    fixture.componentRef.setInput('value', 3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');

    expect(compiled.textContent).toContain('Hours');
    expect(input?.value).toBe('3');
  });

  it('should emit value changes', () => {
    const fixture = TestBed.createComponent(NumberFieldComponent);
    const component = fixture.componentInstance;
    const valueChange = vi.spyOn(component.valueChange, 'emit');

    fixture.componentRef.setInput('label', 'Hours');
    fixture.componentRef.setInput('value', 3);
    fixture.detectChanges();

    component['emitValue']('4');

    expect(valueChange).toHaveBeenCalledWith('4');
  });
});
