import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';
import { authActions } from '@auth/data-access/store';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;
  const initialState = {
    auth: {
      currentUser: undefined,
      submitting: false,
      loading: false,
      errors: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getCurrentUser', () => {
    expect(store.dispatch).toHaveBeenCalledWith(authActions.getCurrentUser());
  });

  it('should have a router outlet', () => {
    const element = fixture.nativeElement as HTMLElement;
    const routerOutlet = element.querySelector('router-outlet');
    expect(routerOutlet)
      .withContext('You need a RouterOutlet component in the AppComponent template')
      .not.toBeNull();
  });

  it('should use the validation-defaults component', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(ValidationDefaultsComponent)))
      .withContext(
        'You probably forgot to add ValidationDefaultsComponent to the AppComponent template'
      )
      .not.toBeNull();
  });
});
