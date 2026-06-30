import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  signup(user: User): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/signup`, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/login`, { email, password }).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  getRole(): string | null {
    return this.getCurrentUser()?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}