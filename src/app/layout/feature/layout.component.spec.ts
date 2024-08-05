import { ComponentFixture, TestBed } from '@angular/core/testing';
import LayoutComponent from './layout.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import MenuComponent from '../ui/menu/menu.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
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
      .withContext('You need a RouterOutlet component in the LayoutComponent template')
      .not.toBeNull();
  });

  it('should use the menu component', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(MenuComponent)))
      .withContext('You probably forgot to add MenuComponent to the LayoutComponent template')
      .not.toBeNull();
  });
});
