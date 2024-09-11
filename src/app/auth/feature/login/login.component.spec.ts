import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import LoginComponent from './login.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { LoginFormComponent } from '@auth/ui/login-form';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
      imports: [LoginComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and link', () => {
    const element = fixture.nativeElement as HTMLElement;

    const title = element.querySelector<HTMLHeadingElement>('h1')!;
    expect(title)
      .withContext('You should have an `h1` element to display the title')
      .not.toBeNull();
    expect(title.textContent).toContain('Sign in');

    const registerLink = element.querySelector<HTMLAnchorElement>('a[href="/register"]')!;
    expect(registerLink)
      .withContext('You should have an `a` element to display the link to the register page')
      .not.toBeNull();
    expect(registerLink.textContent)
      .withContext('The link should have a text')
      .toContain("Don't have an account?");
  });

  it('should render the backend-errors component based on the state', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(BackendErrorsComponent)))
      .withContext("You should NOT have `BackendErrorsComponent` if there's no error")
      .toBeNull();

    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        errors: {
          'email or password': ['is invalid']
        }
      }
    });
    fixture.detectChanges();

    expect(element.query(By.directive(BackendErrorsComponent)))
      .withContext("You should have `BackendErrorsComponent` if there's an error")
      .not.toBeNull();
  });

  it('should use the login-form component', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(LoginFormComponent)))
      .withContext(
        'You probably forgot to add `LoginFormComponent` to the `LoginComponent` template'
      )
      .not.toBeNull();
  });
});
