import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the class on click', () => {
    const element = fixture.nativeElement as HTMLElement;

    const navbarCollapsed = element.querySelector<HTMLElement>('#navbar')!;
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should have the class `collapse`')
      .toContain('collapse');

    const button = element.querySelector<HTMLButtonElement>('.navbar-toggler')!;
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.click();
    fixture.detectChanges();

    const navbar = element.querySelector<HTMLElement>('#navbar')!;
    expect(navbar.classList)
      .withContext(
        'The element with the id `#navbar` should NOT have the class `collapse` after click'
      )
      .not.toContain('collapse');
  });
});
