import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { ConfirmModalContentComponent } from './confirm-modal-content.component';

interface ConfirmOptions {
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmModal {
  constructor(private readonly modal: NgbModal) {}

  public confirm(options: ConfirmOptions): Observable<any> {
    const modalRef = this.modal.open(ConfirmModalContentComponent);
    modalRef.componentInstance.title = options.title ?? 'Confirmation';
    modalRef.componentInstance.message = options.message;
    return from(modalRef.result);
  }
}
