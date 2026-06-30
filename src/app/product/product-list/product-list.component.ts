import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { ProductService } from '../product.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  applyFilters(): void {
    let result = [...this.products];

    // search filter
    if (this.searchQuery.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // sort
    if (this.sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = result;
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation(); // prevent navigating to detail
    this.cartService.addToCart(product).subscribe(() => {
      this.toastService.show(`"${product.name}" added to cart!`);
    });
  }

  goToDetail(id?: string): void {
    if (id) this.router.navigate(['/products', id]);
  }
}
