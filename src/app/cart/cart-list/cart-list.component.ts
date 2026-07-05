import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

    this.checkoutError = '';
    this.placingOrder = true;

    const orderPayload = {
      customer: user._id,
      items: this.cartItem.map((item: any) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        imageUrl: item.imageUrl || ''
      })),
      totalPrice: this.totalPrice,
      placed: false // draft — customer will review before placing
    };

    this.orderService.create(orderPayload).subscribe({
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