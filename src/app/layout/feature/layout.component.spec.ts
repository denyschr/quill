import { ComponentFixture, TestBed } from '@angular/core/testing';
import LayoutComponent from './layout.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from '@layout/ui/navbar';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  const initialState = {
    auth: {
      currentUser: null,
      submitting: false,
      loading: false,
      errors: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a header and navbar', () => {
    const element = fixture.debugElement;

    const header = element.query(By.css('header'));
    expect(header)
      .withContext('You should have a `header` element in your template')
      .not.toBeNull();
    expect(header.nativeElement.classList)
      .withContext('The `header` element should be fixed at the top of the page')
      .toContain('fixed-top');

    expect(element.query(By.directive(NavbarComponent)))
      .withContext(
        'You should have the `NavbarComponent` inside the `header` element to display a navbar'
      )
      .not.toBeNull();
  });

  it('should have a router outlet', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(RouterOutlet)))
      .withContext(
        'You should have a `RouterOutlet` component inside a `main` element to display routed components'
      )
      .not.toBeNull();
  });
});
