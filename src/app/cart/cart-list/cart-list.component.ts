import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product } from 'src/app/models/product';
import { CartService } from '../cart.service';
import { OrderService } from 'src/app/shared/order.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

  totalPrice: number = 0;
  cartItem: Product[] = [];
  placingOrder: boolean = false;
  checkoutError: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItem().subscribe(data => {
      this.cartItem = data;
      this.totalPrice = this.getTotalPrice();
    });
  }

  getTotalPrice(): number {
    let total = 0;
    for (let item of this.cartItem) {
      total += item.price * ((item as any).qty || 1);
    }
    return total;
  }

  changeQty(item: any, delta: number): void {
    const newQty = Math.max(1, (item.qty || 1) + delta);
    item.qty = newQty;
    this.totalPrice = this.getTotalPrice();
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartItem = [];
      this.totalPrice = 0;
    });
  }

  checkout(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.checkoutError = 'Please login to checkout.';
      this.router.navigate(['/login']);
      return;
    }
    if (this.cartItem.length === 0) {
      this.checkoutError = 'Your cart is empty.';
      return;
    }

    // Group cart items by store — the cart can hold items from multiple
    // stores, but each Order must belong to exactly one store. So checkout
    // splits the cart into one draft Order per store.
    const groups = new Map<string, any[]>();
    for (const item of this.cartItem as any[]) {
      const storeId = typeof item.store === 'object' ? item.store?._id : item.store;
      if (!storeId) continue; // skip items missing a store (shouldn't happen for new items)
      if (!groups.has(storeId)) groups.set(storeId, []);
      groups.get(storeId)!.push(item);
    }

    if (groups.size === 0) {
      this.checkoutError = 'Unable to determine the store for these items. Please try removing and re-adding them to your cart.';
      return;
    }

    this.checkoutError = '';
    this.placingOrder = true;

    const orderRequests = Array.from(groups.entries()).map(([storeId, items]) => {
      const totalPrice = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
      const payload = {
        customer: user._id,
        store: storeId,
        items: items.map((item: any) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
          imageUrl: item.imageUrl || ''
        })),
        totalPrice,
        placed: false // draft — customer will review before placing
      };
      return this.orderService.create(payload);
    });

    forkJoin(orderRequests).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe(() => {
          this.placingOrder = false;
          this.router.navigate(['/customer'], { queryParams: { tab: 'purchases' } });
        });
      },
      error: () => {
        this.placingOrder = false;
        this.checkoutError = 'Failed to checkout. Please try again.';
      }
    });
  }

  deleteItem(item: any): void {
    this.cartService.deleteItem(item._id).subscribe(() => {
      this.cartItem = this.cartItem.filter(i => (i as any)._id !== item._id);
      this.totalPrice = this.getTotalPrice();
    });
  }
}