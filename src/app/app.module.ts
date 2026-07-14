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
import { CourierDashboardComponent } from './roles/courier/courier-dashboard/courier-dashboard.component';
import { MapPickerComponent } from './shared/map-picker/map-picker.component';
import { AddressFormComponent } from './roles/customer/address-form/address-form/address-form.component';
import { AddressListComponent } from './roles/customer/address-form/address-list/address-list.component';
import { OrderTrackingMapComponent } from './roles/customer/order-tracking-map/order-tracking-map.component';

// NgRx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    AdminDashboardComponent,
    StoreDashboardComponent,
    CustomerDashboardComponent,
    CourierDashboardComponent,
    MapPickerComponent,
    AddressFormComponent,
    AddressListComponent,
    OrderTrackingMapComponent
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
    FormsModule,

    // NgRx Store
    StoreModule.forRoot({
      auth: authReducer
    }),

    // NgRx Redux DevTools
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }