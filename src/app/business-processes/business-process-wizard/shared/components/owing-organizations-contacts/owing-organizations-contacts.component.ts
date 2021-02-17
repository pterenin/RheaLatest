import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaModal, TaModalRef } from '@trustarc/ui-toolkit';
import { TableService } from '@trustarc/ui-toolkit';
import { BusinessProcessControllerService } from 'src/app/shared/_services/rest-api';
import { BusinessProcessOwnerInterface } from 'src/app/shared/_interfaces';
import { ModalConfirmationBasicComponent } from '../modals/modal-confirmation-basic/modal-confirmation-basic.component';
@Component({
  selector: 'ta-owing-organizations-contacts',
  templateUrl: './owing-organizations-contacts.component.html',
  styleUrls: ['./owing-organizations-contacts.component.scss']
})
export class OwingOrganizationsContactsComponent implements OnInit, OnDestroy {
  @ViewChild('addEditModal') addEditModal: ElementRef;

  public gridID: string;
  public businessProcessId: string;
  public ownersData: BusinessProcessOwnerInterface[];
  public selectedOwner: BusinessProcessOwnerInterface;
  public isEditingOwner: boolean;
  public isShowingLoader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isShowingLoader$ = this.isShowingLoader.asObservable();
  public isFetching: boolean;
  public ownerCount = new BehaviorSubject<number>(0);
  public ownerCount$ = this.ownerCount.asObservable();
  public selected: BusinessProcessOwnerInterface[];
  public thereAreSelectedOwners: boolean;
  public selectedOwners: BusinessProcessOwnerInterface[];
  private _getOwners$: Subscription;
  private _addUpdateOwner$: Subscription;
  private eventRequestRef: Subscription = null;
  private eventSelectedRef: Subscription = null;

  constructor(
    private businessProcessControllerService: BusinessProcessControllerService,
    private activatedRoute: ActivatedRoute,
    private taModal: TaModal,
    private tableService: TableService
  ) {
    this.gridID = 'owingOrganizationContacts';
    this.ownersData = [];
    this.selected = [];
    this.selectedOwners = [];
    this.thereAreSelectedOwners = false;
  }

  public ngOnInit(): void {
    this.selectedOwner = null;
    this.isEditingOwner = false;
    this.isFetching = false;
    this.activatedRoute.parent.params.subscribe(params => {
      this.businessProcessId = params.id;
      this.businessProcessLoadOwners();
    });
    this.subscribeSelectedRowEvent();
    this.subscribeSortEvent();
  }

  public ngOnDestroy(): void {
    if (this._getOwners$) {
      this._getOwners$.unsubscribe();
    }
    if (this._addUpdateOwner$) {
      this._addUpdateOwner$.unsubscribe();
    }
    if (this.eventRequestRef) {
      this.eventRequestRef.unsubscribe();
    }
  }

  public openOwnerModal(): void {
    this.taModal.open(this.addEditModal, {
      windowClass: 'ta-modal-add-edit-owner',
      backdrop: 'static',
      keyboard: true,
      size: 'md'
    });
  }

  public apiBusinessProcessGetOwners() {
    return this.businessProcessControllerService.getOwnersById(
      this.businessProcessId
    );
  }

  public closeModal(reason: string): void {
    this.taModal.dismissAll(reason);
    this.isEditingOwner = false;
  }

  public addOwner(owner: BusinessProcessOwnerInterface): void {
    this.isShowingLoader.next(true);
    this.isFetching = true;
    if (!owner.id) {
      this._addUpdateOwner$ = this.businessProcessControllerService
        .postBusinessProcessOwner(this.businessProcessId, owner)
        .pipe(
          catchError(err => {
            console.error('Unable to create owner API.', err);
            return of(false);
          })
        )
        .subscribe(response => {
          this.finishOwnerRequests();
        });
    } else {
      this._addUpdateOwner$ = this.businessProcessControllerService
        .putBusinessProcessOwner(this.businessProcessId, owner)
        .pipe(
          catchError(err => {
            console.error('Unable to update owner API.', err);
            return of(false);
          })
        )
        .subscribe(response => {
          this.finishOwnerRequests();
        });
    }
  }

  public loadOwnerToEdit(index: number): void {
    this.isEditingOwner = true;
    this.openOwnerModal();
    this.selectedOwner = this.ownersData[index];
  }

  public delete(ownerId: number): void {
    const modalRef = this.taModal.open(ModalConfirmationBasicComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm'
    });
    // [i18n-tobeinternationalized]
    modalRef.componentInstance.btnLabelConfirm = 'Delete';
    modalRef.componentInstance.description =
      'Are you sure you want to delete the selected owner?';
    modalRef.componentInstance.title = 'Delete Confirmation';
    modalRef.componentInstance.type = 'delete';
    modalRef.componentInstance.icon = 'delete';

    this.subscribeModalConfirmationEvents(modalRef, ownerId);
  }

  public deleteOwners(): void {
    const modalRef = this.taModal.open(ModalConfirmationBasicComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm'
    });
    // [i18n-tobeinternationalized]
    modalRef.componentInstance.btnLabelConfirm = 'Delete';
    modalRef.componentInstance.description =
      'Are you sure you want to delete the selected owners?';
    modalRef.componentInstance.title = 'Delete Confirmation';
    modalRef.componentInstance.type = 'delete';
    modalRef.componentInstance.icon = 'delete';

    this.subscribeModalConfirmationEventsMultipleDetele(modalRef);
  }

  public determineSelected(id: string) {
    return this.selected.map(owner => owner.id === id).includes(true);
  }

  private businessProcessLoadOwners(isOwnerAdded?: boolean): void {
    this.isFetching = true;
    this._getOwners$ = this.apiBusinessProcessGetOwners().subscribe(
      response => {
        this.ownersData = response.sort((a, b) => {
          // Turn strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          const aDate = new Date(a.created) as unknown;
          const bDate = new Date(b.created) as unknown;
          return (bDate as number) - (aDate as number);
        });

        if (isOwnerAdded) {
          this.closeModal('owner added');
        }
        this.isFetching = false;
        this.ownerCount.next(this.ownersData.length);
      }
    );
  }

  private finishOwnerRequests(): void {
    this.isShowingLoader.next(false);
    this.businessProcessLoadOwners(true);
    if (this._addUpdateOwner$) {
      this._addUpdateOwner$.unsubscribe();
    }
  }

  private subscribeModalConfirmationEvents(
    modalRef: TaModalRef,
    ownerId: number
  ): void {
    modalRef.componentInstance.confirm.subscribe(confirm => {
      this.isFetching = true;
      this.businessProcessControllerService
        .deleteBusinessProcessOwner(this.businessProcessId, ownerId)
        .pipe(
          catchError(err => {
            console.error('Unable to delete owner API.', err);
            return of(false);
          })
        )
        .subscribe(response => {
          this.finishOwnerRequests();
        });
    });
    modalRef.componentInstance.cancel.subscribe(cancel => {
      modalRef.close('CANCELED');
    });
  }

  private subscribeModalConfirmationEventsMultipleDetele(
    modalRef: TaModalRef
  ): void {
    modalRef.componentInstance.confirm.subscribe(confirm => {
      this.isFetching = true;
      this.businessProcessControllerService
        .deleteBusinessProcessOwners(
          this.businessProcessId,
          this.selectedOwners.map(owner => owner.id)
        )
        .pipe(
          catchError(err => {
            console.error('Unable to delete owners API.', err);
            this.clearSelectedOwners();
            return of(false);
          })
        )
        .subscribe(response => {
          this.clearSelectedOwners();
          this.finishOwnerRequests();
        });
    });
    modalRef.componentInstance.cancel.subscribe(cancel => {
      modalRef.close('CANCELED');
    });
  }

  private clearSelectedOwners(): void {
    this.selectedOwners = [];
    this.tableService.clearAllSelected(this.gridID);
  }

  private subscribeSelectedRowEvent(): void {
    this.eventSelectedRef = this.tableService
      .listenSelectedItemsEvents(this.gridID)
      .subscribe(allSelectedOwners => {
        this.thereAreSelectedOwners = false;
        if (allSelectedOwners.length > 0) {
          this.thereAreSelectedOwners = true;
        }
        this.selectedOwners = allSelectedOwners;
      });
  }

  private subscribeSortEvent(): void {
    this.eventRequestRef = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(request => {
        if (request['sortType']) {
          this.sort(request['columnSort'], request['sortType']);
        }
      });
  }

  private sort(column, type): void {
    if (type === '' || type === 'asc') {
      type = 'desc';
      this.ownersData.sort((b, a) => {
        const stringB = b[column] == null ? '' : b[column];
        const stringA = a[column] === null ? '' : a[column];
        return stringB.toString().localeCompare(stringA.toString());
      });
    } else if (type === 'desc') {
      type = 'asc';
      this.ownersData.sort((a, b) => {
        const stringB = b[column] == null ? '' : b[column];
        const stringA = a[column] === null ? '' : a[column];
        return stringB.toString().localeCompare(stringA.toString());
      });
    }
  }
}
