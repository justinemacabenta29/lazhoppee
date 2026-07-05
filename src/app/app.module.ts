import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartModule } from './cart/cart.module';
import { ToastComponent } from './shared/toast/toast.component';
import { AuthModule } from './auth/auth.module';
import { AdminDashboardComponent } from './roles/admin/admin-dashboard/admin-dashboard.component';
import { StoreDashboardComponent } from './roles/store-owner/store-dashboard/store-dashboard.component';
import { CustomerDashboardComponent } from './roles/customer/customer-dashboard/customer-dashboard.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    AdminDashboardComponent,
    StoreDashboardComponent,
    CustomerDashboardComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CartModule,
    AuthModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }