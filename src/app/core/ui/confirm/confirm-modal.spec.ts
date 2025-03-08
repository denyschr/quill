import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';

import { ConfirmModal } from './confirm-modal';
import { ConfirmModalContentComponent } from './confirm-modal-content.component';

describe('ConfirmModal', () => {
  let confirmModal: ConfirmModal;
  let mockModalRef: jasmine.SpyObj<NgbModalRef>;
  let mockModal: jasmine.SpyObj<NgbModal>;

  beforeEach(() => {
    mockModalRef = jasmine.createSpyObj<NgbModalRef>('NgbModalRef', ['close', 'dismiss'], {
      componentInstance: {},
      result: Promise.resolve()
    });
    mockModal = jasmine.createSpyObj<NgbModal>('NgbModal', ['open']);
    mockModal.open.and.returnValue(mockModalRef);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgbModal,
          useValue: mockModal
        }
      ]
    });
    confirmModal = TestBed.inject(ConfirmModal);
  });

  it('should open a modal with correct options', async () => {
    const mockConfirmOptions = {
      title: 'Confirmation',
      message: 'Are you sure you want to do this?'
    };

    const result = await lastValueFrom(confirmModal.confirm(mockConfirmOptions));
    const confirmModalContent = mockModalRef.componentInstance as ConfirmModalContentComponent;

    expect(mockModal.open).toHaveBeenCalledWith(ConfirmModalContentComponent);
    expect(confirmModalContent.title).toBe(mockConfirmOptions.title);
    expect(confirmModalContent.message).toBe(mockConfirmOptions.message);
    expect(result).toBeUndefined();
  });
});
