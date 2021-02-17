import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { DataElementCategoriesService } from '../../services/data-element-categories/data-element-categories.service';
import { BaseRecordFileUploadService } from '../base-record-file-upload/base-record-file-upload.service';
import { Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';

@AutoUnsubscribe(['_unlinkCategories$'])
@Component({
  selector: 'ta-confirm-unlink-data-element-categories',
  templateUrl: './confirm-unlink-data-element-categories.component.html',
  styleUrls: ['./confirm-unlink-data-element-categories.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmUnlinkDataElementCategoriesComponent
  implements OnInit, OnDestroy {
  private _unlinkCategories$: Subscription;
  public lastSuccessfulResponse: any;

  public unlink: () => Observable<any>;

  @Input() public items: string[];
  @Input() public redButton = false;
  @Input() public contentStart = 'Are you sure you want to unlink';
  @Input() public contentEnd =
    'data elements from the linked business process records?';
  public disabled = false;

  constructor(
    public activeModal: TaActiveModal,
    private dataElementCategoriesService: DataElementCategoriesService,
    public baseRecordFileUploadService: BaseRecordFileUploadService
  ) {}

  ngOnInit() {}

  public getCategories() {
    if (this.items) {
      return this.items.join(', ');
    }
  }

  public onCancel() {
    if (!this.disabled) {
      this.activeModal.dismiss('Cancel');
    }
  }

  public onUnlink() {
    this.disabled = true;
    if (this.items) {
      if (this._unlinkCategories$) {
        this._unlinkCategories$.unsubscribe();
      }
      this._unlinkCategories$ = this.unlink().subscribe(
        result => {
          this.lastSuccessfulResponse = result;
        },
        error => {
          this.disabled = false;
          this.activeModal.dismiss(error.error);
        },
        () => {
          this.disabled = false;
          this.activeModal.close(this.lastSuccessfulResponse);
        }
      );
    }
  }

  ngOnDestroy() {}
}
