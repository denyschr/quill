import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';
import { authActions } from '@auth/data-access/state';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideMockStore()]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a getCurrentUser action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(authActions.getCurrentUser());
  });

  it('should have a router outlet', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(RouterOutlet)))
      .withContext('You need a `RouterOutlet` component in your root component')
      .not.toBeNull();
  });

  it('should use ValidationDefaultsComponent', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(ValidationDefaultsComponent)))
      .withContext(
        'You probably forgot to add `ValidationDefaultsComponent` to the `AppComponent` template'
      )
      .not.toBeNull();
  });
});
