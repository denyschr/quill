import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ValidationDefaultsComponent } from '@app/shared/ui/validation-defaults';
import { authActions } from '@app/auth/data-access/state';

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

  it('should have a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(RouterOutlet)))
      .withContext('You should have RouterOutlet component in your template')
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
