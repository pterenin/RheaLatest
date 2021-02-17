import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild,
  EventEmitter
} from '@angular/core';

import {
  DataFlowFiltersInterface,
  TransferEntity
} from 'src/app/shared/_interfaces/rest-api';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { TableService, ToastService } from '@trustarc/ui-toolkit';
import { DataFlowTableType } from 'src/app/app.constants';
import { PopoverFilterBodyComponent } from '../../shared';

declare const _: any;

@AutoUnsubscribe(['_eventRequestRef$'])
@Component({
  selector: 'ta-system-transfers-table',
  templateUrl: './system-transfers-table.component.html',
  styleUrls: ['./system-transfers-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemTransfersTableComponent implements OnInit, OnDestroy {
  public readonly dataFlowTableType = DataFlowTableType;

  @ViewChild('filterBody') public filterBody: PopoverFilterBodyComponent;
  @Input() gridId: string;
  @Input() transfersData: TransferEntity[];
  @Input() recordType: string;

  @Output() selectionsUpdated = new EventEmitter();
  @Output() showModalDetails = new EventEmitter<TransferEntity>();
  @Output() tableUpdated: EventEmitter<TransferEntity[]> = new EventEmitter();

  public filtersData: DataFlowFiltersInterface;
  public searchTerm = '';
  public searchPlaceholder = '';
  public dataFlowFilters: any;
  public filtersDataMapped: any;

  public _eventRequestRef$: Subscription;

  constructor(
    private tableService: TableService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.initTableSubscriptions();
    this.updateSelected(false);
    this.getFilterData();
    this.getSearchPlaceholder(this.recordType);
  }

  public initTableSubscriptions() {
    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridId)
      .subscribe(request => {
        if (request['sortType']) {
          this.sortTable(request['columnSort'], request['sortType']);
        }
      });
  }

  public getFilterData() {
    if (this.recordType === DataFlowTableType.DATA_SUBJECT) {
      this.filtersDataMapped = {
        categories: {
          id: 'categories',
          label: 'Categories',
          placeholder: 'Select Category',
          data: this.getCategories()
        },
        locations: {
          id: 'locations',
          label: 'Locations',
          placeholder: 'Select Location',
          data: this.getLocations()
        },
        dataElements: {
          id: 'dataElements',
          label: 'Data Elements',
          placeholder: 'Select Data Elements',
          data: this.getDataElements()
        }
      };
    }
    if (this.recordType === DataFlowTableType.DATA_RECIPIENT) {
      this.filtersDataMapped = {
        categories: {
          id: 'categories',
          label: 'Categories',
          placeholder: 'Select Category',
          data: this.getCategories()
        },
        locations: {
          id: 'locations',
          label: 'Locations',
          placeholder: 'Select Location',
          data: this.getLocations()
        },
        dataElements: {
          id: 'dataElements',
          label: 'Data Elements',
          placeholder: 'Select Data Elements',
          data: this.getDataElements()
        },
        processingPurposes: {
          id: 'processingPurposes',
          label: 'Processing Purposes',
          placeholder: 'Select Processing Purposes',
          data: this.getProcessingPurposes()
        }
      };
    }
    if (this.recordType === DataFlowTableType.SYSTEM) {
      this.filtersDataMapped = {
        locations: {
          id: 'locations',
          label: 'Hosting Locations',
          placeholder: 'Select Location',
          data: this.getLocations()
        },
        dataElements: {
          id: 'dataElements',
          label: 'Data Elements',
          placeholder: 'Select Data Elements',
          data: this.getDataElements()
        },
        processingPurposes: {
          id: 'processingPurposes',
          label: 'Processing Purposes',
          placeholder: 'Select Processing Purposes',
          data: this.getProcessingPurposes()
        }
      };
    }
  }

  public getCategories() {
    if (
      this.recordType === DataFlowTableType.DATA_SUBJECT ||
      this.recordType === DataFlowTableType.DATA_RECIPIENT
    ) {
      return this.transfersData.map(item => {
        return {
          id: item.category,
          label: item.category
        };
      });
    }
  }

  public getLocations() {
    if (
      this.recordType === DataFlowTableType.DATA_SUBJECT ||
      this.recordType === DataFlowTableType.DATA_RECIPIENT
    ) {
      const locations = [];
      this.transfersData.forEach(item => locations.push(...item.locations));

      return locations;
    }

    if (this.recordType === DataFlowTableType.SYSTEM) {
      return this.transfersData.map(item => item.location);
    }
  }

  public getDataElements() {
    if (
      this.recordType === DataFlowTableType.DATA_SUBJECT ||
      this.recordType === DataFlowTableType.DATA_RECIPIENT ||
      this.recordType === DataFlowTableType.SYSTEM
    ) {
      const dataElements = [];
      this.transfersData.forEach(item =>
        dataElements.push(...item.dataElements)
      );

      return dataElements;
    }
  }

  public getProcessingPurposes() {
    if (
      this.recordType === DataFlowTableType.DATA_SUBJECT ||
      this.recordType === DataFlowTableType.DATA_RECIPIENT ||
      this.recordType === DataFlowTableType.SYSTEM
    ) {
      const processingPurposes = [];
      this.transfersData.forEach(item =>
        processingPurposes.push(...item.processingPurposes)
      );

      return processingPurposes;
    }
  }

  public isSomeSelected(filteredTransferData: TransferEntity[]): boolean {
    if (filteredTransferData.length === 0) {
      return false;
    }
    return filteredTransferData.some(transfer => transfer.mapped);
  }

  public isAllSelected(filteredTransferData: TransferEntity[]): boolean {
    if (filteredTransferData.length === 0) {
      return false;
    }
    return filteredTransferData.every(transfer => transfer.mapped);
  }

  public isIndeterminate(filteredTransferData: TransferEntity[]): boolean {
    return (
      !this.isAllSelected(filteredTransferData) &&
      this.isSomeSelected(filteredTransferData)
    );
  }

  public allFiltersClick($event, filteredTransferData: TransferEntity[]) {
    $event.preventDefault();

    if (this.isSomeSelected(filteredTransferData)) {
      this.deselectAll(filteredTransferData);
    } else {
      this.selectAll(filteredTransferData);
    }
    this.updateSelected();
  }

  public selectAll(filteredTransferData: TransferEntity[]) {
    filteredTransferData.forEach(transfer => (transfer.mapped = true));
  }

  public deselectAll(filteredTransferData: TransferEntity[]) {
    filteredTransferData.forEach(transfer => (transfer.mapped = false));
  }

  public updateSelected(markAsDirty = true) {
    const selected = this.getSelectedCount();
    this.selectionsUpdated.emit({
      selected,
      markAsDirty
    });
  }

  public getSelectedCount(): number {
    return (this.transfersData || []).filter(transfer => transfer.mapped)
      .length;
  }

  public sortTable(column, type): void {
    if (type === '' || type === 'asc') {
      type = 'desc';
      const data = this.transfersData.sort((b, a) => {
        const strb = this.getSortString(b[column]);
        const stra = this.getSortString(a[column]);
        return strb.localeCompare(stra);
      });

      this.transfersData = [...data];
    } else if (type === 'desc') {
      type = 'asc';
      const data = (this.transfersData = this.transfersData.sort((a, b) => {
        const strb = this.getSortString(b[column]);
        const stra = this.getSortString(a[column]);
        return strb.localeCompare(stra);
      }));

      this.transfersData = [...data];
    }
  }

  public showDetails(event, data: TransferEntity): void {
    event.preventDefault();
    this.showModalDetails.emit(_.cloneDeep(data));
  }

  private getSortString(sortValue): string {
    if (sortValue === undefined || sortValue === null) {
      return '';
    }
    if (Array.isArray(sortValue)) {
      return sortValue.length.toString();
    }
    if (sortValue.id) {
      return sortValue.id;
    }
    return sortValue.toString();
  }

  public onSearch(event) {
    if (event) {
      this.searchTerm = event.searchValue;
    }
  }

  public applyFilterForm() {
    const formValue = this.filterBody.getFilterFormValue();

    const getCheckedIds = arr =>
      arr.filter(item => item.checked === true).map(item => item.id);

    if (this.recordType === DataFlowTableType.DATA_SUBJECT) {
      this.dataFlowFilters = {
        categories: getCheckedIds(formValue.categories),
        locations: getCheckedIds(formValue.locations),
        dataElements: getCheckedIds(formValue.dataElements)
      };
    }
    if (this.recordType === DataFlowTableType.DATA_RECIPIENT) {
      this.dataFlowFilters = {
        categories: getCheckedIds(formValue.categories),
        locations: getCheckedIds(formValue.locations),
        dataElements: getCheckedIds(formValue.dataElements),
        processingPurposes: getCheckedIds(formValue.processingPurposes)
      };
    }
    if (this.recordType === DataFlowTableType.SYSTEM) {
      this.dataFlowFilters = {
        locations: getCheckedIds(formValue.locations),
        dataElements: getCheckedIds(formValue.dataElements),
        processingPurposes: getCheckedIds(formValue.processingPurposes)
      };
    }
  }

  public resetFilterForm() {
    this.filterBody.resetFilterForm();
    this.applyFilterForm();
  }

  public isDirty() {
    return this.filterBody.isDirty();
  }

  public getFilterHeaderTitle() {
    return this.filterBody.getFilterHeaderTitle();
  }

  public getSearchPlaceholder(type) {
    if (type === DataFlowTableType.DATA_SUBJECT) {
      // [i18n-tobeinternationalized]
      this.searchPlaceholder = 'Search Data Subjects';
    }
    if (type === DataFlowTableType.DATA_RECIPIENT) {
      // [i18n-tobeinternationalized]
      this.searchPlaceholder = 'Search Data Recipients';
    }
    if (type === DataFlowTableType.SYSTEM) {
      // [i18n-tobeinternationalized]
      this.searchPlaceholder = 'Search Systems';
    }
  }

  public cloneRow(event, row: TransferEntity, index: number) {
    event.preventDefault();

    const newRow = _.cloneDeep(row);
    newRow.edgeId = null;
    newRow.uniqueId = _.uniqueId('clonned_');

    this.transfersData.splice(index, 0, newRow);
    this.transfersData = [...this.transfersData];

    // [i18n-tobeinternationalized]
    this.toastService.success(
      `You have successfully cloned <strong>${newRow.name}</strong>.`
    );

    this.updateSelected(true);

    this.tableUpdated.emit(this.transfersData);
  }

  ngOnDestroy() {}
}
