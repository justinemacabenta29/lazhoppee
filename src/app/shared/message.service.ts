import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = environment.apiUrl + '/messages';

  constructor(private http: HttpClient) {}

  getInbox(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/inbox/${userId}`);
  }

  getThread(userId: string, otherId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${userId}/${otherId}`);
  }

  send(sender: string, receiver: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}`, { sender, receiver, content });
  }
}