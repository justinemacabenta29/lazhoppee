import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierDashboardComponent } from './courier-dashboard.component';

describe('CourierDashboardComponent', () => {
  let component: CourierDashboardComponent;
  let fixture: ComponentFixture<CourierDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourierDashboardComponent]
    });
    fixture = TestBed.createComponent(CourierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
