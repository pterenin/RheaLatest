import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTransferUpdateData, NodeDetailsData } from '../../_interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {
  private detailsNodeModalLoading = new Subject<boolean>();
  public _detailsNodeModalLoading$ = this.detailsNodeModalLoading.asObservable();

  private detailsNode = new Subject<NodeDetailsData>();
  public _detailsNode$ = this.detailsNode.asObservable();

  private dataTransferUpdateData = new Subject<DataTransferUpdateData>();
  public _dataTransferUpdateData$ = this.dataTransferUpdateData.asObservable();

  public seDetailsNodeModalLoading(isLoading: boolean): void {
    this.detailsNodeModalLoading.next(isLoading);
  }

  public setDetailsNode(nodeInfo: NodeDetailsData): void {
    this.detailsNode.next(nodeInfo);
  }

  public setDataTransferUpdateData(data: DataTransferUpdateData): void {
    this.dataTransferUpdateData.next(data);
  }
}
