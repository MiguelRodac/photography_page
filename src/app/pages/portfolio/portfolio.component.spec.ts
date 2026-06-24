import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PortfolioComponent } from './portfolio.component';
import { PORTFOLIO_SERVICE } from '../../core/tokens/portfolio-service.token';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        { provide: PORTFOLIO_SERVICE, useValue: { getAll: () => of([]) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
