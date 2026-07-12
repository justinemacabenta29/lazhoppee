import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiUrl = environment.apiUrl + '/addresses';

  constructor(private http: HttpClient) {}

  getMyAddresses(userId: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/my/${userId}`);
  }

  create(address: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  update(id: string, address: Partial<Address>): Observable<Address> {
    return this.http.patch<Address>(`${this.apiUrl}/${id}`, address);
  }

  setDefault(id: string): Observable<Address> {
    return this.http.patch<Address>(`${this.apiUrl}/${id}/default`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}