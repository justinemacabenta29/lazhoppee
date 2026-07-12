import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Review } from '../models/review';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private url = environment.apiUrl + '/reviews';

  constructor(private http: HttpClient) {}

  getProductReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.url}/product/${productId}`);
  }

  getMyReviews(customerId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.url}/my/${customerId}`);
  }

  submitReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.url, review);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}