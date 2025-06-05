import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { authActions } from './auth/data-access/state';
import { ValidationDefaultsComponent } from './core/validation';
import { NavbarComponent } from './core/layout';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore()]
    });
    store = TestBed.inject(MockStore);
  });

  it('should dispatch a getCurrentUser action on start', () => {
    spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(authActions.getCurrentUser());
  });

  it('should use the navbar component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(NavbarComponent)))
      .withContext('You should use NavbarComponent in your template to display the navbar')
      .not.toBeNull();
  });

  it('should have a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(RouterOutlet)))
      .withContext('You should have a RouterOutlet component in your root template')
      .not.toBeNull();
  });

  it('should use ValidationDefaultsComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ValidationDefaultsComponent)))
      .withContext(
        'You might have forgot to add ValidationDefaultsComponent to the AppComponent template'
      )
      .not.toBeNull();
  });
});
