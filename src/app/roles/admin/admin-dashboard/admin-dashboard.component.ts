import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from '../admin.service';
import { Store } from 'src/app/models/store';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'stores';
  stores: Store[] = [];
  allUsers: any[] = [];

  selectedCategories: { [key: string]: string[] } = {};
  categories = ['shoes', 'pants', 'tshirt', 'hoodie', 'accessories'];

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadStores();
    this.loadUsers();
  }

  get customers(): any[] {
    return this.allUsers.filter(u => u.role === 'customer');
  }

  get storeOwners(): any[] {
    return this.allUsers.filter(u => u.role === 'store_owner');
  }

  get pendingStoresCount(): number {
    return this.stores.filter(s => !s.approved).length;
  }

  get activeUsersCount(): number {
    return this.allUsers.filter(u => u.active).length;
  }

  loadStores(): void {
    this.adminService.getAllStores().subscribe(data => {
      this.stores = data;
      data.forEach(store => {
        if (store._id) {
          this.selectedCategories[store._id] = [];
        }
      });
    });
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(data => {
      this.allUsers = data.filter(u => u.role !== 'admin');
    });
  }

  toggleCategory(storeId: string, category: string, checked: boolean): void {
    if (!this.selectedCategories[storeId]) {
      this.selectedCategories[storeId] = [];
    }
    if (checked) {
      if (!this.selectedCategories[storeId].includes(category)) {
        this.selectedCategories[storeId].push(category);
      }
    } else {
      this.selectedCategories[storeId] = this.selectedCategories[storeId].filter(c => c !== category);
    }
  }

  isCategoryChecked(storeId: string, category: string): boolean {
    return this.selectedCategories[storeId]?.includes(category) || false;
  }

  approveStore(store: Store): void {
    const categories = this.selectedCategories[store._id!] || [];
    this.adminService.approveStore(store._id!, categories).subscribe(() => {
      this.loadStores();
    });
  }

  rejectStore(id: string): void {
    this.adminService.rejectStore(id).subscribe(() => this.loadStores());
  }

  deleteStore(id: string): void {
    if (confirm('Delete this store permanently?')) {
      this.adminService.deleteStore(id).subscribe(() => this.loadStores());
    }
  }

  activateUser(id: string): void {
    this.adminService.activateUser(id).subscribe(() => this.loadUsers());
  }

  deactivateUser(id: string): void {
    this.adminService.deactivateUser(id).subscribe(() => this.loadUsers());
  }

  deleteUser(id: string): void {
    if (confirm('Delete this account permanently?')) {
      this.adminService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }
}