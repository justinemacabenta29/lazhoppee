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
  navSearchQuery: string = '';
  navSortOrder: string = '';

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
      url.startsWith('/login') ||
      url.startsWith('/signup') ||
      url.startsWith('/admin-login') ||
      url === '/';
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

  onNavSearch(): void {
    const term = this.navSearchQuery.trim();
    const queryParams: any = {};
    if (term) queryParams.search = term;
    if (this.navSortOrder) queryParams.sort = this.navSortOrder;
    this.router.navigate(['/products'], { queryParams });
  }

  onNavSortChange(): void {
    this.onNavSearch();
  }

  // ✅ One-click clear — resets the field and re-runs the search so results reset too
  clearNavSearch(): void {
    this.navSearchQuery = '';
    this.onNavSearch();
  }

  // ✅ FIXED — redirects to /login after logout
  onLogout(): void {
    this.authService.logout();
    this.checkLoginStatus();
    this.router.navigate(['/login']);
  }
}