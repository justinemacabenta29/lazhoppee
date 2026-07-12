import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // ← make sure this exists
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AdminLoginComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,    // ← make sure this is in the imports array
    RouterModule,
    MatButtonModule
  ]
})
export class AuthModule { }