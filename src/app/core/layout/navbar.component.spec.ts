import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { authInitialState } from '@/app/auth/data-access/state';
import { User } from '@/app/auth/data-access/models';

import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let store: MockStore;
  const initialState = {
    auth: authInitialState
  };

  const mockUser = { username: 'jack' } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });
    const collapseConfig = TestBed.inject(NgbCollapseConfig);
    collapseConfig.animation = false;
    store = TestBed.inject(MockStore);
  });

  it('should display a brand link', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const brandLink = fixture.debugElement.query(By.css('[data-test=navbar-brand]'));
    expect(brandLink).withContext('You should have an `a` element for the brand').not.toBeNull();
    expect(brandLink.nativeElement.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe('/');
    expect(brandLink.nativeElement.textContent)
      .withContext('The brand should have a text')
      .toContain('Quill');
  });

  it('should display nav links', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    let links = debugElement.queryAll(By.css('[data-test=navbar-link]'));
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

    links = debugElement.queryAll(By.css('[data-test=navbar-link]'));
    expect(links.length)
      .withContext(
        'You should have 3 nav links: one to the home page, one to the login page and one to the register page, when the user is anonymous'
      )
      .toBe(3);

    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: mockUser
      }
    });
    store.refreshState();
    fixture.detectChanges();

    links = debugElement.queryAll(By.css('[data-test=navbar-link]'));
    expect(links.length)
      .withContext(
        'You should have 4 nav links: one to the home page, one to the editor page, one to the settings page and one to the user profile, when the user is logged in'
      )
      .toBe(4);
  });

  it('should toggle the navigation on click', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const navbarCollapsed = debugElement.query(By.css('[data-test=navbar-content]'));
    expect(navbarCollapsed)
      .withContext('You should have a `div` element for the navbar content`')
      .not.toBeNull();

    const navbarCollapsedElement = navbarCollapsed.nativeElement;
    expect(navbarCollapsedElement.getAttribute('id'))
      .withContext('The `id` attribute of the `div` element is not correct')
      .toBe('primary-navbar');
    expect(navbarCollapsedElement.classList)
      .withContext(
        'The `div` element with the id `#primary-navbar` should use the `ngbCollapse` directive'
      )
      .not.toContain('show');

    const toggleButton = debugElement.query(By.css('[data-test=navbar-toggler]'));
    expect(toggleButton)
      .withContext('You should have a button to collapse the menu')
      .not.toBeNull();

    const toggleButtonElement = toggleButton.nativeElement;
    expect(toggleButtonElement.getAttribute('aria-controls'))
      .withContext('The `aria-controls` attribute of the button is incorrect')
      .toBe('primary-navbar');
    expect(toggleButtonElement.getAttribute('aria-expanded'))
      .withContext('The `aria-expanded` attribute of the button is incorrect')
      .toBe('false');
    expect(toggleButtonElement.getAttribute('aria-label'))
      .withContext('The `aria-label` attribute of the button is incorrect')
      .toContain('Toggle navigation');
    toggleButton.triggerEventHandler('click');
    fixture.detectChanges();

    expect(toggleButtonElement.getAttribute('aria-expanded'))
      .withContext('The `aria-expanded` attribute of the button is incorrect')
      .toBe('true');
    expect(navbarCollapsedElement.classList)
      .withContext(
        'The `div` element with the id `#primary-navbar` should use the `ngbCollapse` directive'
      )
      .toContain('show');
  });
});
