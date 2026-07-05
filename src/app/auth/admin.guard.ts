import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    if (user && user.role === 'admin') {
      return true;
    }

    // Not logged in, or logged in but not admin — send to login
    this.router.navigate(['/login']);
    return false;
  }
}