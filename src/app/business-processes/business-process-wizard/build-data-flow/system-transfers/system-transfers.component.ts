import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
  AfterContentChecked
} from '@angular/core';

import {
  ItSystemNode,
  SendsDataTransfersInterface,
  ReceivesDataTransfersInterface,
  TransferEntity,
  NodeDetailsData
} from 'src/app/shared/_interfaces';
import { DataFlowTableType } from 'src/app/app.constants';
import { FlowChartTypesEnum } from 'src/app/shared/_enums';

@Component({
  selector: 'ta-system-transfers',
  templateUrl: './system-transfers.component.html',
  styleUrls: ['./system-transfers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemTransfersComponent implements OnInit, AfterContentChecked {
  public counterSelectedSubjects = 0;
  public counterSelectedRecipients = 0;
  public counterSelectedSystemsSending = 0;
  public counterSelectedSystemsReceiving = 0;

  public readonly dataFlowTableType = DataFlowTableType;
  @Input() selectedSystemSendingTransfers: SendsDataTransfersInterface;
  @Input() selectedSystemReceivingTransfers: ReceivesDataTransfersInterface;
  @Input() selectedSystem: ItSystemNode;
  @Input() selectedTabId: string;
  @Input() isLoading: boolean;
  @Input() isSaving: boolean;

  @Output() handleTabChanged = new EventEmitter();
  @Output() saveDataTransfer = new EventEmitter();
  @Output() cancelChanges = new EventEmitter();
  @Output() markTableAsDirty = new EventEmitter();
  @Output() showDetailsModal = new EventEmitter<NodeDetailsData>();

  public isCollapsed = {
    isCollapsedSendSubject: false,
    isCollapsedSendSystem: false,
    isCollapsedReceiveRecipient: false,
    isCollapsedReceiveSystem: false
  };

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  public saveData() {
    this.saveDataTransfer.emit();
  }

  public cancel() {
    this.cancelChanges.emit();
  }

  public handleTabChange($event) {
    this.handleTabChanged.emit($event);
  }

  public getReceivesDetailsText(): string {
    // [i18n-tobeinternationalized]
    return `Select the data recipients and system which receive data from
          ${this.selectedSystem.name} (Hosting Location:
          ${this.selectedSystem.locationName})`;
  }

  public getSendsDetailsText(): string {
    // [i18n-tobeinternationalized]
    return `Select the data subjects and systems which send data to
        ${this.selectedSystem.name} (Hosting Location:
        ${this.selectedSystem.locationName})`;
  }

  public getGridId(mode, type) {
    const nodeId = this.selectedSystem.nodeId;
    return `data-flow-${nodeId}-${mode}-${type}`;
  }

  public handleSelectionUpdate(event, type, direction = 'sending') {
    this.updateCounter(event.selected, type, direction);
    if (event.markAsDirty) {
      this.markTableAsDirty.emit();
    }
  }

  public updateCounter(event, type, direction) {
    if (type === DataFlowTableType.DATA_SUBJECT) {
      this.counterSelectedSubjects = event;
    }
    if (type === DataFlowTableType.DATA_RECIPIENT) {
      this.counterSelectedRecipients = event;
    }
    if (type === DataFlowTableType.SYSTEM && direction === 'sending') {
      this.counterSelectedSystemsSending = event;
    }
    if (type === DataFlowTableType.SYSTEM && direction === 'receiving') {
      this.counterSelectedSystemsReceiving = event;
    }
  }

  public handleShowModalDetails(
    data: TransferEntity,
    type: string,
    direction?: string
  ): void {
    const {
      locations,
      dataElements,
      processingPurposes,
      location,
      legalEntityName,
      legalEntityType,
      edgeId,
      nodeId,
      uniqueId
    } = data;
    const info = {
      node: {
        nodeId,
        edgeId,
        uniqueId,
        name: '',
        locations,
        dataElements,
        processingPurposes,
        location,
        legalEntityName,
        legalEntityType
      },
      title: '',
      type,
      editable: true,
      direction
    };

    if (type === DataFlowTableType.DATA_SUBJECT) {
      // [i18n-tobeinternationalized]
      info.title = `Data Subject ${data.name}`;
      // [i18n-tobeinternationalized]
      info.node.name =
        'Deselect any locations or data elements that are not used in this business process record';
    } else if (type === DataFlowTableType.DATA_RECIPIENT) {
      // [i18n-tobeinternationalized]
      info.title = `Data Recipient ${data.name}`;
    }

    if (type === DataFlowTableType.SYSTEM) {
      // [i18n-tobeinternationalized]
      info.title = `It System ${data.name} ${direction} data`;
      info.node.name = data.name;
    }

    this.showDetailsModal.emit((info as unknown) as NodeDetailsData);
  }
}
