import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

  totalPrice: number = 0;
  cartItem: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItem().subscribe(data => {
      this.cartItem = data;
      this.totalPrice = this.getTotalPrice();
    });
  }

  getTotalPrice(): number {
    let total = 0;
    for (let item of this.cartItem) {
      total += item.price * ((item as any).qty || 1); // ← multiply by qty
    }
    return total;
  }

  changeQty(item: any, delta: number): void {
    const newQty = Math.max(1, (item.qty || 1) + delta);
    item.qty = newQty;
    this.totalPrice = this.getTotalPrice();
    // uncomment when backend is ready:
    // this.cartService.updateQty(item._id, newQty).subscribe();
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartItem = [];
      this.totalPrice = 0; // ← set directly to 0, no need to call getTotalPrice
    });
  }

  // ✅ FIXED — was calling non-existent checkout() from service
  checout(): void {
    alert('Checkout coming soon!');
  }

  // ✅ FIXED — was calling non-existent checkout() from service
  deleteItem(item: any): void {
    this.cartService.deleteItem(item._id).subscribe(() => {
      this.cartItem = this.cartItem.filter(i => (i as any)._id !== item._id);
      this.totalPrice = this.getTotalPrice();
    });
  }
}