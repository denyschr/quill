import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsComponent } from './settings.component';
import { By } from '@angular/platform-browser';

import { authActions, authInitialState } from '@/app/auth/data-access/state';
import { BackendErrorsComponent } from '@/app/shared/ui/backend-errors';

import { settingsInitialState } from '../data-access/state';
import { SettingsFormComponent } from '../ui/settings-form';

describe('SettingsComponent', () => {
  let store: MockStore;
  const initialState = {
    settings: settingsInitialState,
    auth: {
      ...authInitialState,
      currentUser: {
        email: 'jack@email.tld',
        username: 'jack'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('[data-test=settings-title]'));
    expect(title).withContext('You should have an `h1` element for the title').not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain('Settings');
  });

  it('should dispatch an updateCurrentUser action when submitting the form', () => {
    const mockUserUpdate = {
      username: 'jack',
      email: 'jack@email.tld',
      bio: 'I work at a state farm'
    };
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    const settingsForm = fixture.debugElement.query(By.directive(SettingsFormComponent));
    expect(settingsForm)
      .withContext('You should have SettingsFormComponent to display the settings form')
      .not.toBeNull();

    settingsForm.componentInstance.submitted.emit(mockUserUpdate);

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.updateCurrentUser({
        user: mockUserUpdate
      })
    );
  });

  it('should display backend error messages if update fails', () => {
    store.setState({
      ...initialState,
      settings: {
        ...initialState.settings,
        errors: {
          email: ['already exists'],
          username: ['has already been taken']
        }
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(SettingsComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const backendErrors = debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent to display backend error messages')
      .not.toBeNull();

    const errors = debugElement.queryAll(By.css('[data-test=error-message]'));
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].nativeElement.textContent).toContain('email already exists');
    expect(errors[1].nativeElement.textContent).toContain('username has already been taken');
  });

  it('should dispatch a logout action when clicking the logout button', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-test=logout-button]'));
    expect(button).withContext('You should have a button to logout the user').not.toBeNull();

    button.triggerEventHandler('click');

    expect(store.dispatch).toHaveBeenCalledWith(authActions.logout());
  });
});
