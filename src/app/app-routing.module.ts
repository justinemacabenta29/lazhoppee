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

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartListComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'store', component: StoreDashboardComponent },
  { path: 'customer', component: CustomerDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }