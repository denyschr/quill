import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { ProfileComponent } from '@app/profile/feature';
import { provideRouter } from '@angular/router';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  const profile = {
    username: 'username',
    bio: 'bio',
    image: 'image'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', profile);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an edit profile link if the owner', () => {
    fixture.componentRef.setInput('owner', true);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const editProfileLink = element.querySelector('a[href="/settings"]')!;
    expect(editProfileLink)
      .withContext('You need an `a` element for the link to the settings page')
      .not.toBeNull();
    expect(editProfileLink.textContent)
      .withContext('The link should have a text')
      .toContain('Edit profile settings');
  });

  it('should display a user information', () => {
    const element: HTMLElement = fixture.nativeElement;

    const image = element.querySelector('img')!;
    expect(image).withContext('You need an image for the user').not.toBeNull();
    expect(image.getAttribute('src'))
      .withContext('The `src` attribute of the image is not correct')
      .toBe(profile.image);
    expect(image.getAttribute('width'))
      .withContext('The `width` attribute of the image is not correct')
      .toBe('120');
    expect(image.getAttribute('height'))
      .withContext('The `height` attribute of the image is not correct')
      .toBe('120');
    expect(image.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is not correct')
      .toBe(profile.username);

    const username = element.querySelector('h1')!;
    expect(username).withContext('You need an `h1` element for the username').not.toBeNull();
    expect(username.textContent).toContain(profile.username);

    const bio = element.querySelector('p')!;
    expect(bio).withContext('You need a `p` element for the bio').not.toBeNull();
    expect(bio.textContent).toContain(profile.bio);
  });
});
