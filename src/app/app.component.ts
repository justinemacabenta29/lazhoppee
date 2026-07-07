import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from './cart/cart.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cartCount: number = 0;
  isLoggedIn: boolean = false;
  currentUserName: string = '';
  currentUserRole: string = '';
  hideMainToolbar: boolean = false;
  
  // ✅ ADDED: Property to track if the user is on a product page
  isProductPage: boolean = false; 

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.checkLoginStatus();
    this.updateToolbarVisibility(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateToolbarVisibility(event.urlAfterRedirects);
        this.checkLoginStatus();
      });
  }

  updateToolbarVisibility(url: string): void {
    this.hideMainToolbar =
      url.startsWith('/admin') ||
      url.startsWith('/store') ||
      url.startsWith('/customer') ||
      url.startsWith('/courier') ||
      url.startsWith('/login') ||    // ← hide on login
      url.startsWith('/signup') ||   // ← hide on signup
      url === '/';

    // ✅ ADDED: Logic to check if the current URL starts with '/products'
    this.isProductPage = url.startsWith('/products');
  }

  checkLoginStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.currentUserName = user?.name || '';
    this.currentUserRole = user?.role || '';
  }

  goToDashboard(): void {
    if (this.currentUserRole === 'store_owner') this.router.navigate(['/store']);
    else if (this.currentUserRole === 'admin') this.router.navigate(['/admin']);
    else if (this.currentUserRole === 'courier') this.router.navigate(['/courier']);
    else this.router.navigate(['/customer']);
  }

  // ✅ FIXED — logout now redirects to /login not /products
  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUserName = '';
    this.currentUserRole = '';
    this.router.navigate(['/login']);
  }
}