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
    this.authService.signup({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role as any
    }).subscribe({
      next: () => {
        this.successMsg = 'Account created! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Signup failed';
      }
    });
  }
}