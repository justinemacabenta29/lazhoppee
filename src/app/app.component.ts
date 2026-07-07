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
    this.hideMainToolbar = url.startsWith('/admin') || url.startsWith('/store') || url.startsWith('/customer') || url.startsWith('/courier');
  }

  checkLoginStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.currentUserName = user?.name || '';
    this.currentUserRole = user?.role || '';
  }

  goToDashboard(): void {
  if (this.currentUserRole === 'store_owner') {
    this.router.navigate(['/store']);
  } else if (this.currentUserRole === 'admin') {
    this.router.navigate(['/admin']);
  } else if (this.currentUserRole === 'courier') {
    this.router.navigate(['/courier']);
  } else {
    this.router.navigate(['/customer']);
  }
}

  onLogout(): void {
    this.authService.logout();
    this.checkLoginStatus();
    this.router.navigate(['/products']);
  }
}