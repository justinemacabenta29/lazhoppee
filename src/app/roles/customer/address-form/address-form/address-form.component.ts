import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Address } from 'src/app/models/address';
import { AddressService } from 'src/app/shared/address.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PickedLocation } from '../../../../shared/map-picker/map-picker.component';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  @Input() existingAddress: Address | null = null;
  @Output() saved = new EventEmitter<Address>();
  @Output() cancelled = new EventEmitter<void>();

  label: 'Home' | 'Work' | 'Other' = 'Home';
  customLabel: string = '';
  fullAddress: string = '';
  lat: number | null = null;
  lng: number | null = null;

  saving: boolean = false;
  errorMsg: string = '';

  // Passed into map-picker so it opens centered on the existing pin when editing
  initialLat: number = 14.5995; // default: Manila
  initialLng: number = 120.9842;

  constructor(
    private addressService: AddressService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.existingAddress) {
      this.label = this.existingAddress.label;
      this.customLabel = this.existingAddress.customLabel || '';
      this.fullAddress = this.existingAddress.fullAddress;
      this.lat = this.existingAddress.lat;
      this.lng = this.existingAddress.lng;
      this.initialLat = this.existingAddress.lat;
      this.initialLng = this.existingAddress.lng;
    }
  }

  onLocationPicked(location: PickedLocation): void {
    this.lat = location.lat;
    this.lng = location.lng;
    this.fullAddress = location.address;
  }

  save(): void {
    this.errorMsg = '';

    if (this.lat === null || this.lng === null) {
      this.errorMsg = 'Please pick a location on the map before saving.';
      return;
    }
    if (this.label === 'Other' && !this.customLabel.trim()) {
      this.errorMsg = 'Please enter a name for this custom address.';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMsg = 'You must be logged in to save an address.';
      return;
    }

    const payload: Partial<Address> = {
      user: user._id,
      label: this.label,
      customLabel: this.label === 'Other' ? this.customLabel.trim() : undefined,
      fullAddress: this.fullAddress,
      lat: this.lat,
      lng: this.lng
    };

    this.saving = true;

    const request$ = this.existingAddress?._id
      ? this.addressService.update(this.existingAddress._id, payload)
      : this.addressService.create(payload);

    request$.subscribe({
      next: (result) => {
        this.saving = false;
        this.saved.emit(result);
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err.error?.error || 'Failed to save address. Please try again.';
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}