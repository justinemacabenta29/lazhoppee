import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { ProductService } from '../product.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  sortOrder: string = '';
  selectedCategory: string = 'all';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Read search/sort coming from the nav bar (?search=...&sort=...)
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.sortOrder = params['sort'] || '';
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.applyFilters();
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];

    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchQuery.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = result;
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.toastService.show(`"${product.name}" added to cart!`);
      },
      error: () => {
        this.toastService.show(`Failed to add "${product.name}" to cart. Please try again.`);
      }
    });
  }

  getOwnerId(product: Product): string | null {
    if (product.store && typeof product.store === 'object' && (product.store as any).owner) {
      return (product.store as any).owner._id;
    }
    return null;
  }

  messageSeller(event: Event, product: Product): void {
    event.stopPropagation();

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.show('Please login to message the seller.');
      this.router.navigate(['/login']);
      return;
    }

    const ownerId = this.getOwnerId(product);
    if (!ownerId) {
      this.toastService.show('Seller info unavailable for this product.');
      return;
    }

    this.router.navigate(['/customer'], {
      queryParams: { tab: 'messages', with: ownerId }
    });
  }

  goToDetail(id?: string): void {
    if (id) this.router.navigate(['/products', id]);
  }
}