import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast$ = new Subject<string>();

  show(message: string): void {
    this.toast$.next(message);
  }
}