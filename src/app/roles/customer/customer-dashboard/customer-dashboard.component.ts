import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomerService } from '../customer.service';
import { OrderService } from 'src/app/shared/order.service';
import { MessageService } from 'src/app/shared/message.service';
import { AddressService } from 'src/app/shared/address.service';
import { ReviewService } from 'src/app/shared/review.service';
import { User } from 'src/app/models/user';
import { Order } from 'src/app/models/order';
import { Review } from 'src/app/models/review';
import { Message, Conversation } from 'src/app/models/message';
import { Address } from 'src/app/models/address';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  activeTab: string = 'account';

  currentUser: User | null = null;
  userId: string = '';
  loading: boolean = true;

  name: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  errorMsg: string = '';
  successMsg: string = '';

  showDeleteConfirm: boolean = false;
  deleteConfirmText: string = '';

  draftOrders: Order[] = [];
  placedOrders: Order[] = [];
  ordersLoading: boolean = true;
  orderErrorMsg: string = '';
  trackingOrderId: string | null = null;

  // ── REVIEWS ──
  reviewMap: { [orderId_productId: string]: Review } = {};
  reviewFormMap: { [key: string]: { rating: number; comment: string; open: boolean } } = {};
  reviewSuccessMap: { [key: string]: string } = {};
  reviewErrorMap: { [key: string]: string } = {};

  // messaging
  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  threadMessages: Message[] = [];
  newMessageText: string = '';
  messagesLoading: boolean = true;
  pendingMessageTargetId: string | null = null;

  // addresses
  addresses: Address[] = [];
  addressesLoading: boolean = true;
  addressErrorMsg: string = '';
  showAddressForm: boolean = false;
  editingAddress: Address | null = null;

  get unreadConversationsCount(): number {
    return this.conversations.filter(c => c.unread).length;
  }

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private messageService: MessageService,
    private addressService: AddressService,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'customer') {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = user._id!;
    this.loadUser();
    this.loadOrders();
    this.loadConversations();
    this.loadAddresses();

    this.route.queryParams.subscribe(params => {
      if (params['tab']) this.activeTab = params['tab'];
      if (params['with']) {
        this.pendingMessageTargetId = params['with'];
        this.tryOpenPendingConversation();
      }
    });
  }

  loadUser(): void {
    this.customerService.getById(this.userId).subscribe({
      next: (data) => {
        this.currentUser = data;
        this.name = data.name;
        this.email = data.email;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  saveAccount(): void {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.name || !this.email) {
      this.errorMsg = 'Name and email are required.';
      return;
    }
    if (this.newPassword || this.confirmPassword) {
      if (this.newPassword.length < 6) {
        this.errorMsg = 'Password must be at least 6 characters.';
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMsg = 'Passwords do not match.';
        return;
      }
    }
    const payload: Partial<User> = { name: this.name, email: this.email };
    if (this.newPassword) payload.password = this.newPassword;

    this.customerService.update(this.userId, payload).subscribe({
      next: (updated) => {
        this.currentUser = updated;
        this.newPassword = '';
        this.confirmPassword = '';
        const stored = this.authService.getCurrentUser();
        if (stored) {
          stored.name = updated.name;
          stored.email = updated.email;
          localStorage.setItem('currentUser', JSON.stringify(stored));
        }
        this.successMsg = 'Account updated successfully.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Failed to update account.';
      }
    });
  }

  confirmDelete(): void {
    if (this.deleteConfirmText !== 'DELETE') {
      this.errorMsg = 'Please type DELETE to confirm.';
      return;
    }
    this.customerService.delete(this.userId).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/products']);
      },
      error: () => { this.errorMsg = 'Failed to delete account.'; }
    });
  }

  // ── ORDERS ──
  loadOrders(): void {
    this.ordersLoading = true;
    this.orderService.getMyOrders(this.userId).subscribe({
      next: (orders) => {
        this.draftOrders = orders.filter(o => !o.placed);
        this.placedOrders = orders.filter(o => o.placed);
        this.ordersLoading = false;

        // load existing reviews for delivered orders
        this.loadMyReviews();
      },
      error: () => { this.ordersLoading = false; }
    });
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  changeDraftQty(order: Order, item: any, delta: number): void {
    item.qty = Math.max(1, (item.qty || 1) + delta);
    order.totalPrice = this.getOrderTotal(order);
  }

  saveDraftChanges(order: Order): void {
    this.orderService.updateItems(order._id!, order.items, this.getOrderTotal(order)).subscribe({
      next: () => { order.totalPrice = this.getOrderTotal(order); },
      error: () => { this.orderErrorMsg = 'Failed to update order.'; }
    });
  }

  removeDraftItem(order: Order, item: any): void {
    order.items = order.items.filter(i => i !== item);
    if (order.items.length === 0) {
      this.orderService.cancel(order._id!).subscribe(() => this.loadOrders());
    } else {
      this.saveDraftChanges(order);
    }
  }

  placeOrder(order: Order): void {
    if (order.items.length === 0) {
      this.orderErrorMsg = 'Cannot place an empty order.';
      return;
    }
    this.orderService.placeOrder(order._id!).subscribe({
      next: () => this.loadOrders(),
      error: () => { this.orderErrorMsg = 'Failed to place order.'; }
    });
  }

  cancelDraft(order: Order): void {
    if (!confirm('Remove this order from your checkout list?')) return;
    this.orderService.cancel(order._id!).subscribe(() => this.loadOrders());
  }

  cancelPlacedOrder(order: Order): void {
    if (order.status !== 'pending') {
      this.orderErrorMsg = 'Only pending orders can be cancelled.';
      return;
    }
    if (!confirm('Cancel this order?')) return;
    this.orderService.updateStatus(order._id!, 'cancelled').subscribe(() => this.loadOrders());
  }

  toggleTracking(order: Order): void {
    this.trackingOrderId = this.trackingOrderId === order._id ? null : order._id!;
  }

  isStepDone(currentStatus: string, step: string): boolean {
  const order = ['pending', 'confirmed', 'in_transit', 'delivered'];
  return order.indexOf(currentStatus) >= order.indexOf(step);
}

  // ── REVIEWS ──
  loadMyReviews(): void {
    this.reviewService.getMyReviews(this.userId).subscribe({
      next: (reviews) => {
        reviews.forEach(r => {
          const key = `${r.order}_${r.product?._id || r.product}`;
          this.reviewMap[key] = r;
        });
      }
    });
  }

  reviewKey(order: Order, item: any): string {
    return `${order._id}_${item.productId}`;
  }

  hasReviewed(order: Order, item: any): boolean {
    return !!this.reviewMap[this.reviewKey(order, item)];
  }

  getReview(order: Order, item: any): Review | null {
    return this.reviewMap[this.reviewKey(order, item)] || null;
  }

  openReviewForm(order: Order, item: any): void {
    const key = this.reviewKey(order, item);
    this.reviewFormMap[key] = { rating: 5, comment: '', open: true };
  }

  closeReviewForm(order: Order, item: any): void {
    const key = this.reviewKey(order, item);
    delete this.reviewFormMap[key];
  }

  isReviewFormOpen(order: Order, item: any): boolean {
    const key = this.reviewKey(order, item);
    return !!this.reviewFormMap[key]?.open;
  }

  setReviewRating(order: Order, item: any, rating: number): void {
    const key = this.reviewKey(order, item);
    if (this.reviewFormMap[key]) this.reviewFormMap[key].rating = rating;
  }

  submitReview(order: Order, item: any): void {
    const key = this.reviewKey(order, item);
    const form = this.reviewFormMap[key];
    if (!form) return;

    this.reviewService.submitReview({
      product: item.productId,
      customer: this.userId,
      order: order._id,
      rating: form.rating,
      comment: form.comment
    }).subscribe({
      next: (review) => {
        this.reviewMap[key] = review;
        delete this.reviewFormMap[key];
        this.reviewSuccessMap[key] = 'Review submitted!';
        setTimeout(() => delete this.reviewSuccessMap[key], 3000);
      },
      error: (err) => {
        this.reviewErrorMap[key] = err.error?.error || 'Failed to submit review.';
        setTimeout(() => delete this.reviewErrorMap[key], 4000);
      }
    });
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? '⭐' : '☆');
  }

  // ── MESSAGES ──
  loadConversations(): void {
    this.messagesLoading = true;
    this.messageService.getInbox(this.userId).subscribe({
      next: (messages) => {
        const map = new Map<string, Conversation>();
        for (const msg of messages) {
          const isSender = (msg.sender._id || msg.sender) === this.userId;
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
        this.tryOpenPendingConversation();
      },
      error: () => { this.messagesLoading = false; }
    });
  }

  tryOpenPendingConversation(): void {
    if (!this.pendingMessageTargetId) return;
    const existing = this.conversations.find(c => c.otherId === this.pendingMessageTargetId);
    if (existing) {
      this.openConversation(existing);
    } else {
      this.activeConversation = {
        otherId: this.pendingMessageTargetId,
        otherName: 'Seller',
        lastMessage: '',
        lastDate: '',
        unread: false
      };
      this.threadMessages = [];
    }
    this.pendingMessageTargetId = null;
  }

  openConversation(conv: Conversation): void {
    this.activeConversation = conv;
    this.messageService.getThread(this.userId, conv.otherId).subscribe({
      next: (data) => this.threadMessages = data
    });
  }

  sendMessage(): void {
    if (!this.newMessageText.trim() || !this.activeConversation) return;
    this.messageService.send(this.userId, this.activeConversation.otherId, this.newMessageText).subscribe({
      next: (msg) => {
        this.threadMessages.push(msg);
        this.newMessageText = '';
        this.loadConversations();
      }
    });
  }

  // ── ADDRESSES ──
  loadAddresses(): void {
    this.addressesLoading = true;
    this.addressService.getMyAddresses(this.userId).subscribe({
      next: (data) => {
        this.addresses = data;
        this.addressesLoading = false;
      },
      error: () => {
        this.addressErrorMsg = 'Failed to load your saved addresses.';
        this.addressesLoading = false;
      }
    });
  }

  openAddAddress(): void {
    this.editingAddress = null;
    this.showAddressForm = true;
  }

  openEditAddress(address: Address): void {
    this.editingAddress = address;
    this.showAddressForm = true;
  }

  onAddressSaved(address: Address): void {
    this.showAddressForm = false;
    this.editingAddress = null;
    this.loadAddresses();
  }

  onAddressCancelled(): void {
    this.showAddressForm = false;
    this.editingAddress = null;
  }

  deleteAddress(address: Address): void {
    if (!confirm('Delete this saved address?')) return;
    this.addressService.delete(address._id!).subscribe({
      next: () => this.loadAddresses(),
      error: () => { this.addressErrorMsg = 'Failed to delete address.'; }
    });
  }

  setDefaultAddress(address: Address): void {
    this.addressService.setDefault(address._id!).subscribe({
      next: () => this.loadAddresses(),
      error: () => { this.addressErrorMsg = 'Failed to set default address.'; }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}