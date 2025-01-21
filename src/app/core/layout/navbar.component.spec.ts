import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@app/shared/data-access/api/models';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let currentUser: User | null | undefined;

  beforeEach(() => {
    currentUser = undefined;

    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])]
    });

    // turn off the animation for the collapse
    const collapseConfig = TestBed.inject(NgbCollapseConfig);
    collapseConfig.animation = false;

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the class on click', () => {
    const element: HTMLElement = fixture.nativeElement;

    const navbarCollapsed = element.querySelector('[data-test=navbar]')!;
    expect(navbarCollapsed)
      .withContext('No element with the attribute `data-test=navbar`')
      .not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext(
        'The element with the attribute `data-test=navbar` should use the `ngbCollapse` directive'
      )
      .not.toContain('show');

    const button = element.querySelector<HTMLButtonElement>('.navbar-toggler')!;
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.click();
    fixture.detectChanges();

    expect(navbarCollapsed.classList)
      .withContext(
        'The element with the attribute `data-test=navbar` should use the `ngbCollapse` directive'
      )
      .toContain('show');
  });

  it('should display two routerLink by default', () => {
    const element = fixture.debugElement;
    const links = element.queryAll(By.directive(RouterLink));
    expect(links.length)
      .withContext('You need only two routerLink: one for the brand, one to the home page')
      .toBe(2);
  });

  it('should display correct routerLink if authenticated', () => {
    currentUser = { username: 'username' } as User;
    fixture.componentRef.setInput('currentUser', currentUser);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    const editorLink = element.querySelector('a[href="/editor"]')!;
    expect(editorLink)
      .withContext('You need an `a` element for the link to the editor')
      .not.toBeNull();
    expect(editorLink.textContent)
      .withContext('The link should have a text')
      .toContain('New Article');

    const settingsLink = element.querySelector('a[href="/settings"]')!;
    expect(settingsLink)
      .withContext('You need an `a` element for the link to the settings page')
      .not.toBeNull();
    expect(settingsLink.textContent)
      .withContext('The link should have a text')
      .toContain('Settings');

    const profileLink = element.querySelector(`a[href="/profile/${currentUser.username}"]`)!;
    expect(profileLink)
      .withContext('You need an `a` element for the link to the user profile')
      .not.toBeNull();
    expect(profileLink.textContent)
      .withContext('The link should have a text')
      .toContain(currentUser.username);
  });

  it('should display correct routerLink if not authenticated', () => {
    currentUser = null;
    fixture.componentRef.setInput('currentUser', currentUser);
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length)
      .withContext('You need two more routerLink: one to the login, one to the register page')
      .toBe(4);
  });
});
