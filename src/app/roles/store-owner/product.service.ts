import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  getByStore(storeId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/store/${storeId}`);
  }

  create(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}