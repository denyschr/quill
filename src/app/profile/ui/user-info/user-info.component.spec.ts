import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UserInfoComponent } from './user-info.component';

describe('UserInfoComponent', () => {
  const mockProfile = {
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    following: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should display user info', () => {
    const fixture = TestBed.createComponent(UserInfoComponent);
    fixture.componentInstance.profile = mockProfile;
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const image = element.querySelector('img')!;
    expect(image).withContext('You should have an image for the user avatar').not.toBeNull();
    expect(image.getAttribute('src'))
      .withContext('The `src` attribute of the image is not correct')
      .toBe(mockProfile.image);
    expect(image.getAttribute('width'))
      .withContext('The `width` attribute of the image is not correct')
      .toBe('120');
    expect(image.getAttribute('height'))
      .withContext('The `height` attribute of the image is not correct')
      .toBe('120');
    expect(image.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is not correct')
      .toBe(mockProfile.username);

    const username = element.querySelector('h1')!;
    expect(username).withContext('You should have an `h1` element for the username').not.toBeNull();
    expect(username.textContent).toContain(mockProfile.username);

    const bio = element.querySelector('p')!;
    expect(bio).withContext('You should have a `p` element for the bio').not.toBeNull();
    expect(bio.textContent).toContain(mockProfile.bio);

    const toggleFollowButton = element.querySelector<HTMLButtonElement>('#toggle-follow-button')!;
    expect(toggleFollowButton)
      .withContext('You should have a button to toggle the following of a user')
      .not.toBeNull();
    expect(toggleFollowButton.textContent)
      .withContext('The button should have a text containing the username')
      .toContain(`Follow ${mockProfile.username}`);

    fixture.componentRef.setInput('profile', { ...mockProfile, following: true });
    fixture.detectChanges();

    expect(toggleFollowButton.textContent)
      .withContext('The button should have a text containing the username')
      .toContain(`Unfollow ${mockProfile.username}`);
  });

  it('should display an edit profile link if can modify', () => {
    const fixture = TestBed.createComponent(UserInfoComponent);
    fixture.componentInstance.profile = mockProfile;
    fixture.componentInstance.canModify = true;
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('#toggle-follow-button'))
      .withContext('You should NOT have a button to toggle the following of a user')
      .toBeNull();

    const editProfileLink = element.querySelector('a[href="/settings"]')!;
    expect(editProfileLink)
      .withContext('You should have an `a` element for the link to the settings page')
      .not.toBeNull();
    expect(editProfileLink.textContent)
      .withContext('The link should have a text')
      .toContain('Edit profile settings');
  });

  it('should emit an output event when clicking the toggle follow button', () => {
    const fixture = TestBed.createComponent(UserInfoComponent);
    const component = fixture.componentInstance;
    fixture.componentInstance.profile = mockProfile;
    fixture.detectChanges();

    spyOn(component.toggledFollow, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '#toggle-follow-button'
    )!;
    button.click();

    expect(component.toggledFollow.emit).toHaveBeenCalled();
  });
});
