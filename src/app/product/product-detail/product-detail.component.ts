import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(data => {
        this.product = data;
      });
    }
  }

  changeQty(delta: number): void {
    this.quantity = Math.max(1, this.quantity + delta);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product).subscribe(() => {
        this.toastService.show(`"${this.product!.name}" added to cart!`);
      });
    }
  }

  getOwnerId(): string | null {
    if (this.product?.store && typeof this.product.store === 'object' && this.product.store.owner) {
      return this.product.store.owner._id;
    }
    return null;
  }

  getStoreName(): string {
    if (this.product?.store && typeof this.product.store === 'object') {
      return this.product.store.name || 'Unknown Store';
    }
    return 'Unknown Store';
  }

  messageSeller(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.show('Please login to message the seller.');
      this.router.navigate(['/login']);
      return;
    }

    const ownerId = this.getOwnerId();
    if (!ownerId) {
      this.toastService.show('Seller info unavailable for this product.');
      return;
    }

    this.router.navigate(['/customer'], {
      queryParams: { tab: 'messages', with: ownerId }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}