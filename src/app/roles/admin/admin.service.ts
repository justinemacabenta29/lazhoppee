import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from 'src/app/models/store';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private storeUrl  = environment.apiUrl + '/stores';
  private userUrl   = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  // ── STORES ──
  getAllStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.storeUrl);
  }

  approveStore(id: string, categories: string[]): Observable<Store> {
    return this.http.patch<Store>(`${this.storeUrl}/${id}/approve`, { categories });
  }

  rejectStore(id: string): Observable<Store> {
    return this.http.patch<Store>(`${this.storeUrl}/${id}/reject`, {});
  }

  deleteStore(id: string): Observable<any> {
    return this.http.delete(`${this.storeUrl}/${id}`);
  }

  // ── USERS ──
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userUrl);
  }

  activateUser(id: string): Observable<any> {
    return this.http.patch(`${this.userUrl}/${id}/activate`, {});
  }

  deactivateUser(id: string): Observable<any> {
    return this.http.patch(`${this.userUrl}/${id}/deactivate`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }
}