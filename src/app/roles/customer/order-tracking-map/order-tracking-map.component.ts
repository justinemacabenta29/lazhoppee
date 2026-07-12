import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { Order } from 'src/app/models/order';
import * as L from 'leaflet';

@Component({
  selector: 'app-order-tracking-map',
  templateUrl: './order-tracking-map.component.html',
  styleUrls: ['./order-tracking-map.component.css']
})
export class OrderTrackingMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() orderId!: string;

  order: Order | null = null;
  loading: boolean = true;

  private map!: L.Map;
  private courierMarker: L.Marker | null = null;
  private deliveryMarker: L.Marker | null = null;
  private pollInterval: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.fetchAndUpdate();
    this.pollInterval = setInterval(() => this.fetchAndUpdate(), 10000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  private initMap(): void {
    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('order-tracking-map-' + this.orderId).setView([14.5995, 120.9842], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  fetchAndUpdate(): void {
    this.orderService.getById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.updateMarkers();
      },
      error: () => { this.loading = false; }
    });
  }

  private updateMarkers(): void {
    if (!this.order) return;

    const bounds: L.LatLngExpression[] = [];

    if (this.order.deliveryLat && this.order.deliveryLng) {
      const deliveryPos: L.LatLngExpression = [this.order.deliveryLat, this.order.deliveryLng];
      if (this.deliveryMarker) {
        this.deliveryMarker.setLatLng(deliveryPos);
      } else {
        this.deliveryMarker = L.marker(deliveryPos).addTo(this.map).bindPopup('Delivery Address');
      }
      bounds.push(deliveryPos);
    }

    if (this.order.courierLat && this.order.courierLng) {
      const courierPos: L.LatLngExpression = [this.order.courierLat, this.order.courierLng];
      if (this.courierMarker) {
        this.courierMarker.setLatLng(courierPos);
      } else {
        const courierIcon = L.divIcon({
          className: 'courier-icon',
          html: '🚚',
          iconSize: [30, 30]
        });
        this.courierMarker = L.marker(courierPos, { icon: courierIcon }).addTo(this.map).bindPopup('Courier');
      }
      bounds.push(courierPos);
    }

    if (bounds.length === 2) {
      this.map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [40, 40] });
    } else if (bounds.length === 1) {
      this.map.setView(bounds[0] as L.LatLngExpression, 15);
    }
  }
}
