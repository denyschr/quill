import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authInitialState } from '@app/auth/data-access/state';
import { getMockedUser } from '@app/testing.spec';

describe('NavbarComponent', () => {
  let store: MockStore;
  const initialState = {
    auth: authInitialState
  };
  const user = getMockedUser();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });
    // turn off the animation for the collapse
    const collapseConfig = TestBed.inject(NgbCollapseConfig);
    collapseConfig.animation = false;
    store = TestBed.inject(MockStore);
  });

  it('should display a brand link', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    const brandLink = element.querySelector('a.navbar-brand[href="/"]')!;
    expect(brandLink)
      .withContext('You should have an `a` element with a class `navbar-brand` for the brand')
      .not.toBeNull();
    expect(brandLink.textContent).withContext('The brand should have a text').toContain('Quill');
  });

  it('should display nav links to navigate', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    const links = element.querySelectorAll('#primary-navbar a.nav-link');
    expect(links.length)
      .withContext(
        'You should have only one nav link to the home page when the user is not defined'
      )
      .toBe(1);

    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: null
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const linksAfterDefined = element.querySelectorAll('#primary-navbar a.nav-link');
    expect(linksAfterDefined.length)
      .withContext(
        'You should have 3 nav links: one to the home page, one to the login page and one to the register page, when the user is defined'
      )
      .toBe(3);

    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: user
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const linksAfterLoggedIn = element.querySelectorAll('#primary-navbar a.nav-link');
    expect(linksAfterLoggedIn.length)
      .withContext(
        'You should have 4 nav links: one to the home page, one to the editor page, one to the settings page and one to the user profile, when the user is logged in'
      )
      .toBe(4);
  });

  it('should display the user if logged in', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const element: HTMLElement = fixture.nativeElement;
    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: user
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const info = element.querySelector('#current-user')!;
    expect(info)
      .withContext(
        'You should have an `a` element with the id `current-user` to display the user info'
      )
      .not.toBeNull();
    expect(info.textContent)
      .withContext('You should display the name of the user')
      .toContain(user.username);
  });

  it('should toggle the navigation on click', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#primary-navbar')!;
    expect(navbarCollapsed).withContext('No element with the id `#primary-navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext(
        'The element with the id `#primary-navbar` should use the `ngbCollapse` directive'
      )
      .not.toContain('show');

    const toggleButton = element.querySelector<HTMLButtonElement>('button.navbar-toggler')!;
    expect(toggleButton)
      .withContext('No `button` element with a class `navbar-toggler` to collapse the menu')
      .not.toBeNull();
    expect(toggleButton.getAttribute('aria-controls'))
      .withContext('The `aria-controls` attribute of the button is incorrect')
      .toBe('primary-navbar');
    expect(toggleButton.getAttribute('aria-expanded'))
      .withContext('The `aria-expanded` attribute of the button is incorrect')
      .toBe('false');
    expect(toggleButton.getAttribute('aria-label'))
      .withContext('The `aria-label` attribute of the button is incorrect')
      .toContain('Toggle navigation');
    toggleButton.click();
    fixture.detectChanges();

    expect(toggleButton.getAttribute('aria-expanded'))
      .withContext('The `aria-expanded` attribute of the button is incorrect')
      .toBe('true');
    expect(navbarCollapsed.classList)
      .withContext(
        'The element with the id `#primary-navbar` should use the `ngbCollapse` directive'
      )
      .toContain('show');
  });
});
