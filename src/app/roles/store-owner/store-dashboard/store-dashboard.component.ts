import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreService } from '../store.service';
import { ProductService } from '../product.service';
import { MessageService } from 'src/app/shared/message.service';
import { OrderService } from 'src/app/shared/order.service';
import { Store } from 'src/app/models/store';
import { Product } from 'src/app/models/product';
import { Message, Conversation } from 'src/app/models/message';
import { Order } from 'src/app/models/order';



@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  styleUrls: ['./store-dashboard.component.css']
})
export class StoreDashboardComponent implements OnInit {
  activeTab: string = 'store';

  store: Store | null = null;
  loading: boolean = true;
  name: string = '';
  description: string = '';
  brand: string = '';
  imageUrl: string = '';
  errorMsg: string = '';
  successMsg: string = '';
  ownerId: string = '';

  products: Product[] = [];
  categories = ['shoes', 'pants', 'tshirt', 'hoodie', 'accessories'];
  showProductForm: boolean = false;
  editingProduct: Product | null = null;
  productName: string = '';
  productPrice: number | null = null;
  productCategory: string = 'shoes';
  productDescription: string = '';
  productBrand: string = '';
  productImageUrl: string = '';
  productStock: number | null = 10;
  productErrorMsg: string = '';

  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  threadMessages: Message[] = [];
  newMessageText: string = '';
  messagesLoading: boolean = true;

  // orders
  orders: Order[] = [];
  ordersLoading: boolean = true;
  orderErrorMsg: string = '';

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private messageService: MessageService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'store_owner') {
      this.router.navigate(['/login']);
      return;
    }
    this.ownerId = user._id!;
    this.loadMyStore();
    this.loadConversations();
  }

  get availableCategories(): string[] {
    return this.store?.categories || [];
  }

  get approvedProductsCount(): number {
    return this.products.filter(p => p.approved).length;
  }

  get pendingProductsCount(): number {
    return this.products.filter(p => !p.approved).length;
  }

  get unreadConversationsCount(): number {
    return this.conversations.filter(c => c.unread).length;
  }

  get pendingOrdersCount(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  loadMyStore(): void {
    this.storeService.getMyStore(this.ownerId).subscribe({
      next: (stores) => {
        this.store = stores.length > 0 ? stores[0] : null;
        if (this.store) {
          this.name = this.store.name;
          this.description = this.store.description || '';
          this
          this.imageUrl = this.store.imageUrl || '';
          this.loadProducts();
          this.loadOrders();
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  saveStore(): void {
    if (!this.name) {
      this.errorMsg = 'Store name is required.';
      return;
    }
    this.errorMsg = '';
    const payload = { name: this.name, description: this.description, brand: this.brand, imageUrl: this.imageUrl, owner: this.ownerId };

    if (this.store) {
      this.storeService.updateStore(this.store._id!, payload).subscribe({
        next: (updated) => {
          this.store = updated;
          this.successMsg = 'Store updated successfully.';
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: () => this.errorMsg = 'Failed to update store.'
      });
    } else {
      this.storeService.createStore(payload).subscribe({
        next: (created) => {
          this.store = created;
          this.successMsg = 'Store created! Waiting for admin approval.';
          setTimeout(() => this.successMsg = '', 4000);
        },
        error: () => this.errorMsg = 'Failed to create store.'
      });
    }
  }

  loadProducts(): void {
    if (!this.store?._id) return;
    this.productService.getByStore(this.store._id).subscribe({
      next: (data) => this.products = data,
      error: () => this.products = []
    });
  }

  openAddProduct(): void {
    this.editingProduct = null;
    this.productName = '';
    this.productBrand = '';
    this.productPrice = null;
    this.productCategory = this.availableCategories[0] || '';
    this.productDescription = '';
    this.productImageUrl = '';
    this.productStock = 10;
    this.productErrorMsg = '';
    this.showProductForm = true;
  }

  openEditProduct(product: Product): void {
    this.editingProduct = product;
    this.productName = product.name;
    this.productBrand = product.brand || '';
    this.productPrice = product.price;
    this.productCategory = product.category || 'shoes';
    this.productDescription = product.description || '';
    this.productImageUrl = product.imageUrl || '';
    this.productStock = product.stock ?? 10;
    this.productErrorMsg = '';
    this.showProductForm = true;
  }

  cancelProductForm(): void {
    this.showProductForm = false;
    this.editingProduct = null;
  }

  saveProduct(): void {
    if (!this.productName || !this.productPrice) {
      this.productErrorMsg = 'Name and price are required.';
      return;
    }
    if (!this.store?._id) return;

    const payload: Partial<Product> = {
      name: this.productName,
      brand: this.productBrand,
      price: this.productPrice,
      category: this.productCategory,
      description: this.productDescription,
      imageUrl: this.productImageUrl,
      stock: this.productStock ?? 10,
      store: this.store._id
    };

    if (this.editingProduct) {
      payload.approved = false;
      this.productService.update(this.editingProduct._id!, payload).subscribe({
        next: () => {
          this.showProductForm = false;
          this.loadProducts();
        },
        error: () => this.productErrorMsg = 'Failed to update product.'
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => {
          this.showProductForm = false;
          this.loadProducts();
        },
        error: () => this.productErrorMsg = 'Failed to create product.'
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.productService.delete(product._id!).subscribe({
      next: () => this.loadProducts()
    });
  }

  loadConversations(): void {
    this.messagesLoading = true;
    this.messageService.getInbox(this.ownerId).subscribe({
      next: (messages) => {
        const map = new Map<string, Conversation>();

        for (const msg of messages) {
          const isSender = (msg.sender._id || msg.sender) === this.ownerId;
          const other = isSender ? msg.receiver : msg.sender;
          const otherId = other._id || other;
          const otherName = other.name || 'Unknown';

          if (!map.has(otherId)) {
            map.set(otherId, {
              otherId,
              otherName,
              lastMessage: msg.content,
              lastDate: msg.createdAt || '',
              unread: !isSender && !msg.read
            });
          }
        }

        this.conversations = Array.from(map.values());
        this.messagesLoading = false;
      },
      error: () => { this.messagesLoading = false; }
    });
  }

  openConversation(conv: Conversation): void {
    this.activeConversation = conv;
    this.messageService.getThread(this.ownerId, conv.otherId).subscribe({
      next: (data) => this.threadMessages = data
    });
  }

  sendMessage(): void {
    if (!this.newMessageText.trim() || !this.activeConversation) return;

    this.messageService.send(this.ownerId, this.activeConversation.otherId, this.newMessageText).subscribe({
      next: (msg) => {
        this.threadMessages.push(msg);
        this.newMessageText = '';
      }
    });
  }

  // ── ORDERS (Confirm + Monitor) ──
  loadOrders(): void {
    if (!this.store?._id) return;
    this.ordersLoading = true;
    this.orderService.getStoreOrders(this.store._id).subscribe({
      next: (data) => {
        this.orders = data;
        this.ordersLoading = false;
      },
      error: () => {
        this.orderErrorMsg = 'Failed to load orders.';
        this.ordersLoading = false;
      }
    });
  }

  getOrderItemsSummary(order: Order): string {
    return order.items.map(i => `${i.name} × ${i.qty}`).join(', ');
  }

  confirmOrder(order: Order): void {
    this.orderService.updateStatus(order._id!, 'confirmed').subscribe({
      next: () => this.loadOrders(),
      error: () => { this.orderErrorMsg = 'Failed to confirm order.'; }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }
}