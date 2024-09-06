import { ComponentFixture, TestBed } from '@angular/core/testing';
import RegisterComponent from './register.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { RegisterFormComponent } from '@auth/ui/register-form';
import { authActions } from '@auth/data-access/store';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
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
      imports: [RegisterComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RegisterComponent);
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
    expect(title.textContent).toContain('Sign up');

    const loginLink = element.querySelector<HTMLAnchorElement>('a[href="/login"]')!;
    expect(loginLink)
      .withContext('You should have an `a` element to display the link to the login page')
      .not.toBeNull();
    expect(loginLink.textContent)
      .withContext('The link should have a text')
      .toContain('Have an account?');
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

  it('should use the register-form component', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(RegisterFormComponent)))
      .withContext(
        'You probably forgot to add `RegisterFormComponent` to the `RegisterComponent` template'
      )
      .not.toBeNull();
  });

  it('should dispatch register', () => {
    const credentials = {
      username: 'den',
      email: 'den@gmail.com',
      password: '12345678'
    };
    const registerForm = fixture.debugElement.query(By.directive(RegisterFormComponent));
    registerForm.componentInstance.submitted.emit(credentials);
    expect(store.dispatch).toHaveBeenCalledWith(authActions.register({ credentials }));
  });
});
