import { TestBed } from '@angular/core/testing';
import { CarbTargetPanelComponent } from './carb-target-panel.component';

describe('CarbTargetPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbTargetPanelComponent],
    }).compileComponents();
  });

  it('should render the target state and labels', () => {
    const fixture = TestBed.createComponent(CarbTargetPanelComponent);
    fixture.componentRef.setInput('state', 'under target');
    fixture.componentRef.setInput('currentLabel', '120 g');
    fixture.componentRef.setInput('goalLabel', '240 g');
    fixture.componentRef.setInput('delta', -120);
    fixture.componentRef.setInput('deltaLabel', '120 g remaining');
    fixture.componentRef.setInput('progress', 50);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const progress = compiled.querySelector('progress');

    expect(compiled.textContent).toContain('under target');
    expect(compiled.textContent).toContain('120 g / 240 g');
    expect(compiled.textContent).toContain('120 g remaining');
    expect(progress?.getAttribute('value')).toBe('50');
  });
});
