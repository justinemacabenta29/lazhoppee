import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '../../models/store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private apiUrl = environment.apiUrl + '/stores';

  constructor(private http: HttpClient) {}

  getMyStore(ownerId: string): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}/my/${ownerId}`);
  }

  createStore(data: Partial<Store>): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}`, data);
  }

  updateStore(id: string, data: Partial<Store>): Observable<Store> {
    return this.http.patch<Store>(`${this.apiUrl}/${id}`, data);
  }
}