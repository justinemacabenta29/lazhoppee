import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {  // ← add OnInit
  message: string = '';
  visible: boolean = false;

  constructor(private toastService: ToastService) {}  // ← add constructor

  ngOnInit(): void {
    this.toastService.toast$.subscribe(msg => {
      this.message = msg;
      this.visible = true;
      setTimeout(() => this.visible = false, 3000);
    });
  }
}