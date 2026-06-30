import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.role === 'admin') this.router.navigate(['/admin']);
        else if (user.role === 'store_owner') this.router.navigate(['/store']);
        else this.router.navigate(['/products']);
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}