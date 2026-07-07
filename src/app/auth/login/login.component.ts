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
  selectedRole: string = 'customer';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.role !== this.selectedRole) {
          this.errorMsg = `This account is not registered as a ${this.selectedRole.replace('_', ' ')}.`;
          return;
        }

        // ✅ redirect each role to their own dashboard
        if (user.role === 'admin') this.router.navigate(['/admin']);
        else if (user.role === 'store_owner') this.router.navigate(['/store']);
        else if (user.role === 'courier') this.router.navigate(['/courier']);
        else this.router.navigate(['/customer']); // ← customer goes to customer dashboard
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}