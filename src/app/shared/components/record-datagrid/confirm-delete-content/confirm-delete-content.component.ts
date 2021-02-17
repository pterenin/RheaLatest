import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  TaActiveModal,
  TableService,
  ToastService
} from '@trustarc/ui-toolkit';

import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { DatatableService } from 'src/app/shared/services/record-listing/datatable.service';

import { BaseRecordService } from 'src/app/shared/services/base-record/base-record.service';
import { BaseRecordFileUploadService } from '../../base-record-file-upload/base-record-file-upload.service';

import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { DataSubjectsService } from '../../../services/data-subjects/data-subjects.service';
import { ProcessingPurposesService } from '../../../services/processing-purposes/processing-purposes.service';

import { DataElementCategoriesService } from 'src/app/shared/services/data-element-categories/data-element-categories.service';
import { DataSubjectCategoriesService } from 'src/app/shared/services/data-subject-categories/data-subject-categories.service';
import { ProcessingPurposeCategoriesService } from '../../../services/processing-purpose-categories/processing-purpose-categories.service';

import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { exists } from 'src/app/shared/utils/basic-utils';

import { Subscription } from 'rxjs';

@AutoUnsubscribe([
  '_getCurrentSelectedPageItems$',
  '_deleteBpByIdList$',
  '_deleteCategories$',
  '_deleteDataElements$',
  '_getBpToBeDeleted$',
  '_getFileToBeDeleted$'
])
@Component({
  selector: 'ta-confirm-delete-content',
  templateUrl: './confirm-delete-content.component.html',
  styleUrls: ['./confirm-delete-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDeleteContentComponent implements OnInit, OnDestroy {
  private _deleteBpByIdList$: Subscription;
  private _deleteCategories$: Subscription;
  private _deleteDataElements$: Subscription;
  private _deleteDataSubjects$: Subscription;
  private _deleteProcessingPurposes$: Subscription;
  private _getCurrentSelectedPageItems$: Subscription;
  private _getBpToBeDeleted$: Subscription;

  private selected_items: any[];

  @Input() public fileValue: any;
  @Input() public items: any[];
  @Input() public redButton = false;
  @Input() public isCategoryModal = false;
  @Input() public dataType: 'DE' | 'PP' | 'DS' = 'DE';
  @Input() public target: 'ELEMENT' | 'CATEGORY' = 'CATEGORY';
  @Input() public gridId: string;
  @Input() public title = 'Confirm Delete';
  @Input() public content =
    'Are you sure you want to delete the following records?';
  @Input() public buttonPlacement: 'fill' | 'left' | 'right' = 'fill';
  @HostBinding('class.modal-white') whiteModal = false;
  public disabled = false;

  constructor(
    public activeModal: TaActiveModal,
    private toastService: ToastService,
    private dataElementsService: DataElementsService,
    private dataSubjectsService: DataSubjectsService,
    private processingPurposesService: ProcessingPurposesService,
    private datagridHeaderService: DatagridHeaderService,
    private datatableService: DatatableService,
    private tableService: TableService,
    private baseRecordService: BaseRecordService,
    public baseRecordFileUploadService: BaseRecordFileUploadService,
    private dataElementCategoriesService: DataElementCategoriesService,
    private dataSubjectCategoriesService: DataSubjectCategoriesService,
    private processingPurposeCategoriesService: ProcessingPurposeCategoriesService
  ) {}

  ngOnInit() {
    if (this.isCategoryModal) {
      return;
    }
    if (this.datagridHeaderService.getCurrentSelectedPageItems()) {
      this._getCurrentSelectedPageItems$ = this.datagridHeaderService
        .getCurrentSelectedPageItems()
        .subscribe((items: any[]) => {
          this.items = items;
        });
    }

    if (this.datatableService.getCurrentSelectedPageItems()) {
      this._getCurrentSelectedPageItems$ = this.datatableService
        .getCurrentSelectedPageItems()
        .subscribe((items: any[]) => {
          this.items = items;
        });
    }

    if (this.datagridHeaderService.getDeleteIndividualBpSubject()) {
      this._getBpToBeDeleted$ = this.datagridHeaderService
        .getDeleteIndividualBpSubject()
        .subscribe((item: any) => {
          if (exists(item)) {
            // backup existing selected items
            this.selected_items = this.items;
            this.items = [item];
          }
        });
    }

    if (
      this.gridId !== undefined &&
      this.tableService.getSelected(this.gridId)
    ) {
      this.items = this.tableService.getSelected(this.gridId);
    }
  }

  public getItemIdentifiers(): string[] {
    if (this.items) {
      return this.items.map(item => item.identifier);
    } else {
      return null;
    }
  }

  public getCategories() {
    if (Array.isArray(this.items)) {
      return this.items
        .map(item => {
          const { category, name } = item;
          if (typeof category === 'string') {
            return category;
          }
          if (typeof category === 'object') {
            return name;
          }
          return name || '';
        })
        .join(', ');
    }
  }

  public getFileName(): string {
    if (this.fileValue) {
      return this.fileValue.fileName;
    } else {
      return null;
    }
  }

  public onCancel() {
    if (!this.disabled) {
      this.activeModal.dismiss('Cancel');
    }
  }

  public onDelete() {
    this.disabled = true;

    if (this.items && this.isCategoryModal) {
      if (
        this.items[0] &&
        this.items[0].category &&
        this.target === 'CATEGORY'
      ) {
        this.deleteCategories();
      } else if (this.dataType === 'DE') {
        this.deleteDataElements();
      } else if (this.dataType === 'PP') {
        this.deleteProcessingPurposes();
      } else if (this.dataType === 'DS') {
        this.deleteDataSubjects();
      }
    } else if (this.fileValue) {
      this.deleteFile(this.fileValue.index);
    } else if (this.items) {
      this.deleteItems();
    }
  }

  private deleteItems() {
    if (this._deleteBpByIdList$) {
      this._deleteBpByIdList$.unsubscribe();
    }

    this._deleteBpByIdList$ = this.baseRecordService
      .deleteRecordsByIdList(this.items)
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
          // restore existing selected items
          if (exists(this.selected_items)) {
            this.items = this.selected_items;
            this.selected_items = null;
          }
        },
        error => {
          this.disabled = false;
          this.activeModal.dismiss(error);
        }
      );
  }

  private deleteCategories() {
    if (this._deleteCategories$) {
      this._deleteCategories$.unsubscribe();
    }

    if (this.dataType === 'PP') {
      this.deleteCategoriesPP();
    } else if (this.dataType === 'DE') {
      this.deleteCategoriesDE();
    } else if (this.dataType === 'DS') {
      this.deleteCategoriesDS();
    } else {
      console.error('Unsupported data type.');
    }
  }

  private deleteCategoriesPP() {
    this._deleteCategories$ = this.processingPurposeCategoriesService
      .deleteProcessingPurposesCategories(this.items)
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
        },
        error => {
          this.disabled = false;
          this.activeModal.close(error);
        }
      );
  }

  private deleteCategoriesDE() {
    this._deleteCategories$ = this.dataElementCategoriesService
      .deleteDataElementCategories(this.items)
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
        },
        error => {
          this.disabled = false;
          this.activeModal.close(error);
        }
      );
  }

  private deleteCategoriesDS() {
    this._deleteCategories$ = this.dataSubjectCategoriesService
      .deleteDataSubjectCategories(this.items)
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
        },
        error => {
          this.disabled = false;
          this.activeModal.close(error);
        }
      );
  }

  private deleteDataElements() {
    if (this._deleteDataElements$) {
      this._deleteDataElements$.unsubscribe();
    }

    this._deleteDataElements$ = this.dataElementsService
      .deleteDataElements(this.items.map(item => item.id))
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
        },
        error => {
          this.disabled = false;
          this.activeModal.close(error);
        }
      );
  }

  private deleteProcessingPurposes() {
    if (this._deleteProcessingPurposes$) {
      this._deleteProcessingPurposes$.unsubscribe();
    }

    this._deleteProcessingPurposes$ = this.processingPurposesService
      .deleteProcessingPurposes(this.items.map(item => item.id))
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
        },
        error => {
          this.disabled = false;
          this.activeModal.close(error);
        }
      );
  }

  private deleteDataSubjects() {
    if (this._deleteDataSubjects$) {
      this._deleteDataSubjects$.unsubscribe();
    }

    this._deleteDataSubjects$ = this.dataSubjectsService
      .deleteDataSubjects(this.items.map(item => item.id))
      .subscribe(
        () => {
          this.disabled = false;
          this.activeModal.close();
        },
        error => {
          this.disabled = false;
          this.activeModal.close(error);
        }
      );
  }

  private deleteFile(index) {
    this.baseRecordFileUploadService.removeFile(index);
    this.disabled = false;
    this.activeModal.close();
  }

  ngOnDestroy() {}
}
