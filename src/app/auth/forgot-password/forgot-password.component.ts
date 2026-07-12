import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  step: 'email' | 'reset' = 'email';

  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  errorMsg: string = '';
  successMsg: string = '';
  loading: boolean = false;

  private authUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private router: Router) {}

  checkEmail(): void {
    this.errorMsg = '';
    if (!this.email.trim()) {
      this.errorMsg = 'Please enter your email.';
      return;
    }
    // Move straight to reset step — actual existence check happens on submit
    this.step = 'reset';
  }

  resetPassword(): void {
    this.errorMsg = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMsg = 'Please fill in both password fields.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.http.post<any>(`${this.authUrl}/reset-password`, {
      email: this.email,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Failed to reset password. Please try again.';
      }
    });
  }

  backToEmail(): void {
    this.step = 'email';
    this.errorMsg = '';
  }
}