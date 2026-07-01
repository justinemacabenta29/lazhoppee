import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  }

  checkLoginStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.currentUserName = user?.name || '';
    this.currentUserRole = user?.role || '';
  }

  onAdminLogin(): void {
    this.authService.login('justine@gmail.com', 'justine123').subscribe({
      next: (user) => {
        if (user.role === 'admin') {
          this.checkLoginStatus();
          this.router.navigate(['/admin']);
        } else {
          alert('This account is not an admin.');
        }
      },
      error: () => {
        alert('Admin login failed. Please check your credentials in MongoDB.');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUserName = '';
    this.currentUserRole = '';
    this.router.navigate(['/products']);
  }
}