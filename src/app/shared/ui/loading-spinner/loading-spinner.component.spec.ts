import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a loading indicator', () => {
    const element = fixture.nativeElement as HTMLElement;
    const spinner = element.querySelector<HTMLElement>('.spinner-border')!;
    expect(spinner)
      .withContext('You should have a div with a class `spinner-border` to show a spinner')
      .not.toBeNull();
    expect(spinner.getAttribute('role'))
      .withContext('The `role` attribute of the spinner is not correct')
      .toBe('status');
    expect(spinner.textContent)
      .withContext('The text content of the spinner is not correct')
      .toContain('Loading...');
  });
});
