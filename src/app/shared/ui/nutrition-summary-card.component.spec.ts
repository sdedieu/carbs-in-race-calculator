import { TestBed } from '@angular/core/testing';
import { NutritionSummaryCardComponent } from './nutrition-summary-card.component';

describe('NutritionSummaryCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionSummaryCardComponent],
    }).compileComponents();
  });

  it('should render summary values', () => {
    const fixture = TestBed.createComponent(NutritionSummaryCardComponent);
    fixture.componentRef.setInput('label', 'Carbs');
    fixture.componentRef.setInput('value', '80 g');
    fixture.componentRef.setInput('perHour', '40 g/h');
    fixture.componentRef.setInput('tone', 'green');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Carbs');
    expect(compiled.textContent).toContain('80 g');
    expect(compiled.textContent).toContain('40 g/h');
  });
});
