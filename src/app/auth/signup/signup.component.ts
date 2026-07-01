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
        this.successMsg = this.role === 'store_owner'
          ? 'Account created! Waiting for admin approval.'
          : 'Account created! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Signup failed. Email may already be in use.';
      }
    });
  }
}