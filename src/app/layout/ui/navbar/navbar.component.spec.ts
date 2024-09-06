import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;
  const initialState = {
    auth: {
      currentUser: undefined,
      submitting: false,
      loading: false,
      errors: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
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

  it('should display correct links for anonymous users', () => {
    store.setState({ ...initialState, auth: { ...initialState.auth, currentUser: null } });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    const homeLink = element.querySelector<HTMLAnchorElement>('a[href="/"]:not(.navbar-brand)')!;
    expect(homeLink)
      .withContext(
        'You should have an `a` element to display the link to the home page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(homeLink.textContent).withContext('The link should have a text').toContain('Home');

    const loginLink = element.querySelector('a[href="/login"]')!;
    expect(loginLink)
      .withContext(
        'You should have an `a` element to display the link to the login page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(loginLink.textContent).withContext('The link should have a text').toContain('Sign in');

    const registerLink = element.querySelector<HTMLAnchorElement>('a[href="/register"]')!;
    expect(registerLink)
      .withContext(
        'You should have an `a` element to display the link to the register page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(registerLink.textContent)
      .withContext('The link should have a text')
      .toContain('Sign up');
  });

  it('should display correct links for logged in users', () => {
    store.setState({
      ...initialState,
      auth: { ...initialState.auth, currentUser: { username: 'denys' } }
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    const homeLink = element.querySelector<HTMLAnchorElement>('a[href="/"]:not(.navbar-brand)')!;
    expect(homeLink)
      .withContext(
        'You should have an `a` element to display the link to the home page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(homeLink.textContent).withContext('The link should have a text').toContain('Home');

    const articleLink = element.querySelector<HTMLAnchorElement>('a[href="/articles"]')!;
    expect(articleLink)
      .withContext(
        'You should have an `a` element to display the link to the article page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(articleLink.textContent)
      .withContext('The link should have a text')
      .toContain('New Article');

    const settingsLink = element.querySelector<HTMLAnchorElement>('a[href="/settings"]')!;
    expect(settingsLink)
      .withContext(
        'You should have an `a` element to display the link to the settings page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(settingsLink.textContent)
      .withContext('The link should have a text')
      .toContain('Settings');

    const profileLink = element.querySelector<HTMLAnchorElement>('a[href="/profiles/denys"]')!;
    expect(profileLink)
      .withContext(
        'You should have an `a` element to display the link to the profile page. Maybe you forgot to use `routerLink`?'
      )
      .not.toBeNull();
    expect(profileLink.textContent)
      .withContext('You should display the name of the user in an `a` element')
      .toContain('denys');
  });
});
