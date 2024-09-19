/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  template: `
    <ql-pagination url="/" [itemCount]="itemCount" [limit]="limit" [currentPage]="currentPage" />
  `,
  imports: [PaginationComponent]
})
class PaginationTestComponent {
  public itemCount = 100;
  public limit = 10;
  public currentPage = 1;
}

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(PaginationTestComponent);
    fixture.detectChanges();
  });

  it('should display a correct number of page links', () => {
    const element = fixture.nativeElement as HTMLElement;
    const links = element.querySelectorAll<HTMLAnchorElement>('a');
    expect(links.length).toBe(10);
  });

  it('should apply correct classes to active and inactive links', () => {
    const element = fixture.nativeElement as HTMLElement;
    const links = element.querySelectorAll<HTMLAnchorElement>('a');
    expect(links[0].classList).toContain('btn-success');
    expect(links[1].classList).toContain('btn-outline-success');
  });

  it('should display correct page numbers', () => {
    const element = fixture.nativeElement as HTMLElement;
    const links = element.querySelectorAll<HTMLAnchorElement>('a');
    expect(links[0].textContent).toContain(1);
    expect(links[1].textContent).toContain(2);
  });

  it('should set correct query params', () => {
    const element = fixture.nativeElement as HTMLElement;
    const links = element.querySelectorAll<HTMLAnchorElement>('a');
    expect(links[1].getAttribute('href')).toBe('/?page=2');
  });
});
