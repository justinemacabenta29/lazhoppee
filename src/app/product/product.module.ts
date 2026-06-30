import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';           // ← add for [(ngModel)]
import { RouterModule } from '@angular/router';         // ← add for routerLink
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // ← add for mat-icon
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,      // ← for search [(ngModel)]
    RouterModule,     // ← for navigation
    MatCardModule,
    MatButtonModule,  // ← for mat-raised-button in detail page
    MatIconModule,    // ← for mat-icon
    FlexModule
  ]
})
export class ProductModule { }
