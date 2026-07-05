import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.role !== 'admin') {
          this.errorMsg = 'This account is not registered as an Admin.';
          return;
        }
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}