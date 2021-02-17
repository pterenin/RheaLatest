import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  AuditCollectionInterface,
  AuditInterface
} from '../../models/audit.model';
import { BaseRecordService } from '../../services/base-record/base-record.service';
import { Subscription } from 'rxjs';
import { getRouteParamObservable } from '../../utils/route-utils';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { TableService } from '@trustarc/ui-toolkit';
import { DatatableService } from '../../services/record-listing/datatable.service';

@AutoUnsubscribe(['_paramMap$', '_eventRequestRef$'])
@Component({
  selector: 'ta-audit-table',
  templateUrl: './audit-table.component.html',
  styleUrls: ['./audit-table.component.scss']
})
export class AuditTableComponent implements OnInit, OnDestroy {
  public gridId: string;
  public tableData: AuditInterface[];
  public response: AuditCollectionInterface;
  public totalRows = 0;
  public maxRows = 15;
  public page = 1;
  private sort = '';
  private _paramMap$: Subscription;
  private _eventRequestRef$: Subscription;
  private systemId: string;

  @Output() finishedLoad = new EventEmitter();

  constructor(
    private baseRecordService: BaseRecordService,
    private route: ActivatedRoute,
    private tableService: TableService,
    private datatableService: DatatableService
  ) {
    this.tableData = [];
    this.gridId = 'auditTableId';
    this.datatableService.initGridSources(this.gridId);
  }

  ngOnInit() {
    this._paramMap$ = getRouteParamObservable(
      this.route.paramMap,
      'id'
    ).subscribe(id => {
      this.systemId = id;
      this.renderData();
    });

    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridId)
      .subscribe(request => {
        this.sort = request.columnSort
          ? request.columnSort + ',' + request.sortType
          : '';
        this.renderData();
      });
  }

  public onChangePageSize(pageSize: number): void {
    this.maxRows = pageSize;
    this.renderData();
  }

  public onChangePage(event) {
    if (event) {
      this.page = event;
      this.renderData();
    }
  }

  private renderData() {
    this.baseRecordService
      .getAuditsById(this.systemId, this.maxRows, this.page, this.sort)
      .subscribe(auditResponse => {
        this.totalRows = auditResponse.totalElements;
        this.tableData = auditResponse.changes;
        this.finishedLoad.emit(this.totalRows);
      });
  }

  ngOnDestroy() {}
}
