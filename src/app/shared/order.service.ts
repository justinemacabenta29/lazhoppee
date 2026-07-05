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

  create(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateItems(id: string, items: any[], totalPrice: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/items`, { items, totalPrice });
  }

  placeOrder(id: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/place`, {});
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status });
  }

  cancel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}