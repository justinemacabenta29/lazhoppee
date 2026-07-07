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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }
}