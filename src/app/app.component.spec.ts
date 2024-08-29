import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideMockStore({})]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
