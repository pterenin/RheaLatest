import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';
import { TaPopover, TaPaginationConfig } from '@trustarc/ui-toolkit';

import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import {
  DataInterface,
  CategoricalViewComponent
} from 'src/app/shared/components/categorical-view/categorical-view.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

declare const _: any;

export interface ReviewTableRowInterface {
  category: string;
  processingPurpose: string;
  legalBasis?: LegalBasisOptionInterface;
  processingPurposeId: string;
  isCustom?: boolean;
  isCategoryCustom?: boolean;
}

export interface LegalBasisOptionInterface {
  id: string;
  label: string;
}

@AutoUnsubscribe(['_legalBasisOptions$', '_processingPurposes$'])
@Component({
  selector: 'ta-review-table',
  templateUrl: './review-table.component.html',
  styleUrls: ['./review-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CategoricalViewComponent)
  categoricalViewComponent: CategoricalViewComponent;
  @ViewChildren(TaPopover) popovers: QueryList<TaPopover>;

  @Input() public tableDataInput: Array<ReviewTableRowInterface> = [];
  @Input() public legalBasesInput: any;

  @Output() public tableChanged = new EventEmitter<any>();

  private tableDataSubject: BehaviorSubject<any>;
  public tableData$: Observable<ReviewTableRowInterface[]>;
  public legalBasisOptions: DataInterface;
  public associatedProcessingPurposeId: string;

  public tableId = 'REVIEW_TABLE';
  public totalRows = 0;
  public pageSize = 5;
  public currentPage = 1;

  private SORT_DEFAULT = 'category';
  public sortProperty = this.SORT_DEFAULT;
  public sortOrder = true;
  public sortEvent: any;

  public legalBasisStyleClass = 'legal-basis-class';
  public legalBasisPopoverStyleClass = 'legal-basis-popover-class';

  private businessProcessId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private taPaginationConfig: TaPaginationConfig
  ) {
    if (this.activatedRoute.parent) {
      this.businessProcessId = this.activatedRoute.parent.snapshot.params.id;
    }
  }

  ngOnInit() {
    this.taPaginationConfig.paginatorRows = [5, 25, 50, 75, 100, 200];
    this.tableDataSubject = new BehaviorSubject(this.tableDataInput);
    this.tableData$ = this.tableDataSubject.asObservable();

    this.legalBasisOptions = this.mapLegalBasisforCategoricalDropDownOptions(
      this.legalBasesInput
    );
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  private mapLegalBasisforCategoricalDropDownOptions(options): DataInterface {
    const result: DataInterface = _(options)
      .groupBy(option => option.category)
      .map((opts, cat) => {
        return {
          id: cat,
          label: cat,
          items: opts.map(optionItem => {
            return {
              id: optionItem.id,
              label: optionItem.shortName
            };
          })
        };
      })
      .value();

    return result;
  }

  public onChangePage($event: number) {
    this.currentPage = $event;
  }

  public onChangeMax($event) {
    this.pageSize = $event;
    this.tableDataSubject.next(this.tableDataInput);
    this.tableChanged.emit(this.tableDataInput);
  }

  public selectLegalBasis($event) {
    if (this.associatedProcessingPurposeId) {
      const processingPurpose = this.tableDataInput.find(
        pp => pp.processingPurposeId === this.associatedProcessingPurposeId
      );
      processingPurpose.legalBasis = {
        id: $event.id,
        label: $event.label
      };
      this.associatedProcessingPurposeId = null;
      this.tableDataSubject.next(this.tableDataInput);
      this.tableChanged.emit(this.tableDataInput);
    }
    this.popovers.forEach(element => element.close());
  }

  popOverProcessingPurpose(processingPurposeId) {
    this.associatedProcessingPurposeId = processingPurposeId;
  }

  onSort(event) {
    this.sortProperty = event.column;
    this.sortOrder = event.direction === 'asc' ? true : false;
    this.tableDataSubject.next(this.tableDataInput);
    this.tableChanged.emit(this.tableDataInput);
  }
}
