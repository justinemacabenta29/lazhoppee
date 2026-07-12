import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

export interface PickedLocation {
  lat: number;
  lng: number;
  address: string;
}

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.css']
})
export class MapPickerComponent implements OnInit, AfterViewInit {
  @Input() initialLat: number = 14.5995;  // default: Manila
  @Input() initialLng: number = 120.9842;
  @Output() locationPicked = new EventEmitter<PickedLocation>();

  private map!: L.Map;
  private marker!: L.Marker;

  searchQuery: string = '';
  searching: boolean = false;
  searchError: string = '';
  resolvedAddress: string = '';
  locating: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Fix default marker icon paths (common Leaflet + Angular issue)
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

    this.map = L.map('map-picker-container').setView([this.initialLat, this.initialLng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.marker = L.marker([this.initialLat, this.initialLng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      this.reverseGeocode(pos.lat, pos.lng);
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    // Resolve initial position's address on load
    this.reverseGeocode(this.initialLat, this.initialLng);
  }

  searchAddress(): void {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.searching = true;
    this.searchError = '';

    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search`, {
      params: { q: query, format: 'json', limit: '1' }
    }).subscribe({
      next: (results) => {
        this.searching = false;
        if (results.length === 0) {
          this.searchError = 'No matching location found.';
          return;
        }
        const lat = parseFloat(results[0].lat);
        const lng = parseFloat(results[0].lon);
        this.map.setView([lat, lng], 16);
        this.marker.setLatLng([lat, lng]);
        this.resolvedAddress = results[0].display_name;
        this.emitLocation(lat, lng, this.resolvedAddress);
      },
      error: () => {
        this.searching = false;
        this.searchError = 'Search failed. Please try again.';
      }
    });
  }

  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.searchError = 'Geolocation is not supported by your browser.';
      return;
    }
    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.map.setView([lat, lng], 16);
        this.marker.setLatLng([lat, lng]);
        this.reverseGeocode(lat, lng);
        this.locating = false;
      },
      () => {
        this.searchError = 'Unable to get your location. Please allow location access.';
        this.locating = false;
      }
    );
  }

  private reverseGeocode(lat: number, lng: number): void {
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse`, {
      params: { lat: lat.toString(), lon: lng.toString(), format: 'json' }
    }).subscribe({
      next: (result) => {
        this.resolvedAddress = result.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        this.emitLocation(lat, lng, this.resolvedAddress);
      },
      error: () => {
        this.resolvedAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        this.emitLocation(lat, lng, this.resolvedAddress);
      }
    });
  }

  private emitLocation(lat: number, lng: number, address: string): void {
    this.locationPicked.emit({ lat, lng, address });
  }
}