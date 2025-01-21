import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from '@app/layout/ui/navbar';

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
    });

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the navbar component', () => {
    const element: HTMLElement = fixture.nativeElement;

    const header = element.querySelector('header')!;
    expect(header).withContext('You need a `header` element for the navbar').not.toBeNull();
    expect(header.classList)
      .withContext('The `header` element should be fixed at the top of the page')
      .toContain('fixed-top');
    expect(fixture.debugElement.query(By.directive(NavbarComponent)))
      .withContext('You need `NavbarComponent` inside the `header` element for the navbar')
      .not.toBeNull();
  });

  it('should have a router outlet', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(RouterOutlet)))
      .withContext('You need a `RouterOutlet` component in your template')
      .not.toBeNull();
  });
});
