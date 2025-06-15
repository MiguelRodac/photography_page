import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeV0Component } from './home-v0.component';

describe('HomeV0Component', () => {
  let component: HomeV0Component;
  let fixture: ComponentFixture<HomeV0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeV0Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeV0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
