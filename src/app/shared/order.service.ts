import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) {}

  getMyOrders(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my/${customerId}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getAvailableOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/available`);
  }

  getCourierOrders(courierId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/courier/${courierId}`);
  }

  getStoreOrders(storeId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/store/${storeId}`);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  claimOrder(orderId: string, courierId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/assign`, { courierId });
  }

  create(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateItems(id: string, items: any[], totalPrice: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/items`, { items, totalPrice });
  }

  placeOrder(id: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/place`, {});
  }

  confirmOrder(id: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/confirm`, {});
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status });
  }

  updateDeliveryLocation(id: string, lat: number, lng: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/delivery-location`, { lat, lng });
  }

  updateCourierLocation(id: string, lat: number, lng: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/courier-location`, { lat, lng });
  }

  cancel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}