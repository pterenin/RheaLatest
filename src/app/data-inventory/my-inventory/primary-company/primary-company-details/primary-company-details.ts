import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { DetailInterface } from './primary-company-details.model';
import { ActivatedRoute } from '@angular/router';
import { PrimaryCompanyDetailsService } from './primary-company-details.service';
import { map } from 'rxjs/operators';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { CompletionStateService } from 'src/app/shared/services/completion-state/completion-state.service';
import { CanDeactivateTabInterface } from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { getErrorMessageNoPermissionsToViewRecord } from 'src/app/shared/utils/error-utils';

@Component({
  selector: 'ta-primary-company-details',
  templateUrl: './primary-company-details.html',
  styleUrls: ['./primary-company-details.scss']
})
export class PrimaryCompanyDetailsComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() public showRiskFields: boolean;
  @Output() public detailsLoaded = new EventEmitter();

  public isNextButtonDisabled = false;
  public contactInfoAdded = false;
  public details: DetailInterface;

  private cancelChanges: boolean;
  private _onCancelSubscription$: Subscription;

  public detailsForm: FormGroup;
  public notes = new FormControl('', Validators.maxLength(1024));
  public isValid: Boolean = true;

  private _formChangeSubscription$: Subscription[] = [];

  constructor(
    private primaryCompanyDetailsService: PrimaryCompanyDetailsService,
    private completionStateService: CompletionStateService,
    private dataInventoryService: DataInventoryService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.detailsForm = formBuilder.group({
      notes: this.notes
    });
  }

  ngOnInit() {
    this.primaryCompanyDetailsService
      .getPrimaryEntity(this.route.snapshot.params.id)
      .subscribe(
        result => {
          this.detailsLoaded.emit(result);
          this.initializePage(result);
        },
        err => {
          const { status } = err;
          if (status === 404 || status === 403) {
            const message = getErrorMessageNoPermissionsToViewRecord();
            return this.toastService.error(message, null, 5000);
          }
          // [i18n-tobeinternationalized]
          this.toastService.error('Error retrieving primary company.');
          console.error(err);
        }
      );
    this.onCancelChanges();
  }

  ngOnDestroy() {
    if (
      this._formChangeSubscription$ &&
      this._formChangeSubscription$.length > 0
    ) {
      this._formChangeSubscription$.forEach(sub => sub.unsubscribe);
    }
    this.onCancelChangesSubscriber();
  }

  public initializePage(details) {
    this.details = details;
    this.detailsForm.get('notes').patchValue(details.notes);
  }

  private onCancelChanges() {
    this.onCancelChangesSubscriber();
    this._onCancelSubscription$ = this.dataInventoryService.getCancelFormChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.cancelChanges = true;
          this.dataInventoryService.goBackDataInventoryListPage();
        }
      }
    );
  }

  private onCancelChangesSubscriber() {
    if (this._onCancelSubscription$) {
      this._onCancelSubscription$.unsubscribe();
    }
  }

  public save(): Observable<BaseDomainInterface> {
    if (!this.detailsForm.dirty || this.cancelChanges) {
      return of({ id: null, version: null });
    }

    this.detailsForm.markAsPristine();

    return this.completionStateService.watchCompletionState(
      this.primaryCompanyDetailsService.savePrimaryEntity({
        id: this.details.entity.id,
        notes: this.detailsForm.get('notes').value,
        version: this.details.entity.version
      })
    );
  }

  public onSubmit() {
    console.log('onSubmit');
  }

  public getCityState(contact) {
    const city = contact.city ? contact.city : '--';
    const stateOrProvince = contact.stateOrProvince
      ? contact.stateOrProvince
      : '--';
    return `${city ? city + ', ' : ''}${
      stateOrProvince ? stateOrProvince : ''
    }`;
  }

  canDeactivateTab(): Observable<boolean> {
    return this.save().pipe(map(result => true));
  }
}
