import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminDashboardComponent } from './roles/admin/admin-dashboard/admin-dashboard.component';
import { StoreDashboardComponent } from './roles/store-owner/store-dashboard/store-dashboard.component';
import { CustomerDashboardComponent } from './roles/customer/customer-dashboard/customer-dashboard.component';
import { CourierDashboardComponent } from './roles/courier/courier-dashboard/courier-dashboard.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartListComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'store', component: StoreDashboardComponent, canActivate: [AuthGuard] },
  { path: 'customer', component: CustomerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'courier', component: CourierDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }