import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from '@shared/data-access/models';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let currentUser: UserModel | null | undefined;

  beforeEach(() => {
    currentUser = undefined;

    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

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
    const element = fixture.debugElement;

    const navbarCollapsed = element.query(By.css('[data-test-id="navbar"]'));
    expect(navbarCollapsed)
      .withContext('No element with the attribute `data-test-id="navbar"`')
      .not.toBeNull();
    expect(navbarCollapsed.nativeElement.classList)
      .withContext(
        'The element with the attribute `data-test-id="navbar"` should use the `ngbCollapse` directive'
      )
      .not.toContain('show');

    const button = element.query(By.css('.navbar-toggler'));
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.nativeElement.click();

    fixture.detectChanges();

    expect(navbarCollapsed.nativeElement.classList)
      .withContext(
        'The element with the attribute `data-test-id="navbar"` should use the `ngbCollapse` directive'
      )
      .toContain('show');
  });

  it('should display two routerLink by default', () => {
    const element = fixture.debugElement;
    const links = element.queryAll(By.directive(RouterLink));
    expect(links.length)
      .withContext('You should only have two routerLink: one for the brand, one to the home page')
      .toBe(2);
  });

  it('should display correct routerLink if authenticated', () => {
    currentUser = { username: 'denys' } as UserModel;
    fixture.componentRef.setInput('currentUser', currentUser);
    fixture.detectChanges();

    const element = fixture.debugElement;

    const editorLink = element.query(By.css('a[href="/editor"]'));
    expect(editorLink)
      .withContext('You should have an `a` element to display the link to the editor')
      .not.toBeNull();
    expect(editorLink.nativeElement.textContent)
      .withContext('The link should be `New Article`')
      .toContain('New Article');

    const settingsLink = element.query(By.css('a[href="/settings"]'));
    expect(settingsLink)
      .withContext('You should have an `a` element to display the link to the settings page')
      .not.toBeNull();
    expect(settingsLink.nativeElement.textContent)
      .withContext('The link should be `Settings`')
      .toContain('Settings');

    const profileLink = element.query(By.css(`a[href="/profile/${currentUser.username}"]`));
    expect(profileLink)
      .withContext('You should have an `a` element to display the link to the user profile')
      .not.toBeNull();
    expect(profileLink.nativeElement.textContent)
      .withContext(`The link should be \`${currentUser.username}\``)
      .toContain(currentUser.username);
  });

  it('should display an image of the user if available', () => {
    currentUser = { username: 'denys', image: 'image' } as UserModel;
    fixture.componentRef.setInput('currentUser', currentUser);
    fixture.detectChanges();

    const element = fixture.debugElement;

    const userImage = element.query(By.css(`img[src="${currentUser.image}"]`));
    expect(userImage)
      .withContext('You should have an `img` element to display the image of the user')
      .not.toBeNull();
    expect(userImage.nativeElement.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is not correct')
      .toBe(currentUser.username);
  });

  it('should display correct routerLink if not authenticated', () => {
    currentUser = null;
    fixture.componentRef.setInput('currentUser', currentUser);
    fixture.detectChanges();

    const element = fixture.debugElement;

    const links = element.queryAll(By.directive(RouterLink));
    expect(links.length)
      .withContext(
        'You should have two more routerLink: one to the login, one to the register page'
      )
      .toBe(4);
  });
});
