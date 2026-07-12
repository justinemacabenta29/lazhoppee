import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { OrderService } from 'src/app/shared/order.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-courier-dashboard',
  templateUrl: './courier-dashboard.component.html',
  styleUrls: ['./courier-dashboard.component.css']
})
export class CourierDashboardComponent implements OnInit {
  activeTab: string = 'available';
  courierId: string = '';

  availableOrders: Order[] = [];
  myDeliveries: Order[] = [];
  loading: boolean = true;
  errorMsg: string = '';

  // ── Live location update ──
  locatingOrderId: string | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'courier') {
      this.router.navigate(['/login']);
      return;
    }
    this.courierId = user._id!;
    this.loadAvailable();
    this.loadMyDeliveries();
  }

  loadAvailable(): void {
    this.orderService.getAvailableOrders().subscribe({
      next: (data) => { this.availableOrders = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadMyDeliveries(): void {
    this.orderService.getCourierOrders(this.courierId).subscribe({
      next: (data) => { this.myDeliveries = data; }
    });
  }

  claimOrder(order: Order): void {
    this.orderService.claimOrder(order._id!, this.courierId).subscribe({
      next: () => {
        this.loadAvailable();
        this.loadMyDeliveries();
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Failed to claim order.';
        this.loadAvailable(); // refresh in case it was just claimed by someone else
      }
    });
  }

  markDelivered(order: Order): void {
    this.orderService.updateStatus(order._id!, 'delivered').subscribe(() => this.loadMyDeliveries());
  }

  markUnsuccessful(order: Order): void {
    if (!confirm('Mark this delivery as unsuccessful?')) return;
    this.orderService.updateStatus(order._id!, 'unsuccessful').subscribe(() => this.loadMyDeliveries());
  }

  // ── Live location update ──
  updateMyLocation(order: Order): void {
    if (!order._id) return;

    if (!navigator.geolocation) {
      this.errorMsg = 'Geolocation is not supported by this browser.';
      return;
    }

    this.errorMsg = '';
    this.locatingOrderId = order._id;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.orderService.updateCourierLocation(order._id!, latitude, longitude).subscribe({
          next: (updated) => {
            order.courierLat = updated.courierLat;
            order.courierLng = updated.courierLng;
            order.courierLocationUpdatedAt = updated.courierLocationUpdatedAt;
            this.locatingOrderId = null;
          },
          error: () => {
            this.errorMsg = 'Failed to send your location. Please try again.';
            this.locatingOrderId = null;
          }
        });
      },
      () => {
        this.errorMsg = 'Could not get your location. Please check location permissions.';
        this.locatingOrderId = null;
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }
}