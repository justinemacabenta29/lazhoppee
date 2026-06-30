import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartUrl = environment.apiUrl + '/cart';

  cartCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.refreshCount();
  }

  refreshCount(): void {
    this.http.get<Product[]>(this.cartUrl).subscribe(items => {
      this.cartCount$.next(items.length);
    });
  }

  getCartItem(): Observable<Product[]> {
    return this.http.get<Product[]>(this.cartUrl);
  }

  addToCart(product: Product): Observable<Product> {
    return this.http.post<Product>(this.cartUrl, {
      ...product,
      imageUrl: product.imageUrl || ''
    }).pipe(
      tap(() => this.cartCount$.next(this.cartCount$.value + 1))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.cartUrl).pipe(
      tap(() => this.cartCount$.next(0))
    );
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.cartUrl}/${id}`).pipe(
      tap(() => this.cartCount$.next(Math.max(0, this.cartCount$.value - 1)))
    );
  }

  updateQty(id: string, qty: number): Observable<any> {
    return this.http.patch(`${this.cartUrl}/${id}`, { qty });
  }
}