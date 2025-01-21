import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@app/shared/ui/confirm-modal';
import { from, Observable } from 'rxjs';

interface ConfirmOptions {
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  constructor(private readonly _modalService: NgbModal) {}

  public confirm(options: ConfirmOptions): Observable<any> {
    const modalRef = this._modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = options.title ?? 'Confirmation';
    modalRef.componentInstance.message = options.message;
    return from(modalRef.result);
  }
}
