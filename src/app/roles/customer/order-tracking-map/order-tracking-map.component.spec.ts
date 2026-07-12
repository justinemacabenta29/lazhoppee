import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrackingMapComponent } from './order-tracking-map.component';

describe('OrderTrackingMapComponent', () => {
  let component: OrderTrackingMapComponent;
  let fixture: ComponentFixture<OrderTrackingMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTrackingMapComponent]
    });
    fixture = TestBed.createComponent(OrderTrackingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
