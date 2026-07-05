import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'customer';
  errorMsg: string = '';
  successMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }

    this.authService.signup({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role as any
    }).subscribe({
      next: () => {
        if (this.role === 'admin') {
          this.successMsg = 'Admin account created! Redirecting to Admin Login...';
          setTimeout(() => this.router.navigate(['/admin-login']), 2000);
        } else if (this.role === 'store_owner') {
          this.successMsg = 'Account created! Waiting for admin approval.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.successMsg = 'Account created! Please login.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Signup failed. Email may already be in use.';
      }
    });
  }
}