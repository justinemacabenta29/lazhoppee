import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  onLogin(): void {
    this.errorMsg = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {

        // Save the logged-in user in the NgRx Store
        this.store.dispatch(AuthActions.loginSuccess({ user }));

        if (user.role !== this.selectedRole) {
          this.errorMsg = `This account is not registered as a ${this.selectedRole.replace('_', ' ')}.`;
          return;
        }

        if (user.role === 'store_owner') {
          this.router.navigate(['/store']);
        } else if (user.role === 'courier') {
          this.router.navigate(['/courier']);
        } else {
          this.router.navigate(['/customer']);
        }
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}