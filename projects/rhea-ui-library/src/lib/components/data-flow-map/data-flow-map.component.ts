import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';

import { DataFlowChartInterface } from '../../interfaces/data-flow-chart.interface';

const ENTITY_TYPES = {
  dataSubjects: 'DATA_SUBJECT',
  itSystems: 'IT_SYSTEM_1ST_PARTY',
  dataRecipients: 'DATA_RECIPIENT'
};

declare const _: any;

@Component({
  selector: 'ta-data-flow-map',
  templateUrl: './data-flow-map.component.html',
  styleUrls: ['./data-flow-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowMapComponent implements OnInit {
  @Input() public data: DataFlowChartInterface;
  @Input() public hideControls: boolean;

  @Output() renderComplete = new EventEmitter();

  public mappedData: any[] = [];

  ngOnInit() {
    this.data = _.cloneDeep(this.data);
    this.mapData();
  }

  private findBlockById(id: string) {
    let block;
    const types = Object.keys(ENTITY_TYPES);
    types.forEach(type => {
      if (block) {
        return;
      }
      block = this.data[type].find(item => item.blockId === id);
      if (block) {
        block.type = ENTITY_TYPES[type];
      }
    });
    return block;
  }

  private getMapBlock(id: string) {
    const block = this.findBlockById(id);
    if (!block) {
      return;
    }
    const location = block.locations
      ? block.locations.map(l => l.id)
      : block.location.id;
    return {
      id: block.blockId,
      location: location,
      name: block.name,
      type: block.type
    };
  }

  private flatLocations(mappedData): [] {
    let isFlat = true;
    mappedData.forEach(mapBlock => {
      if (_.isArray(mapBlock.from.location)) {
        isFlat = false;
        mapBlock.from.location.forEach((location, index) => {
          if (index > 0) {
            const newBlock = _.cloneDeep(mapBlock);
            newBlock.from.location = location;
            mappedData.splice(index, 0, newBlock);
          }
        });
        mapBlock.from.location = mapBlock.from.location[0];
      }
      if (_.isArray(mapBlock.to.location)) {
        isFlat = false;
        mapBlock.to.location.forEach((location, index) => {
          if (index > 0) {
            const newBlock = _.cloneDeep(mapBlock);
            newBlock.to.location = location;
            mappedData.splice(index, 0, newBlock);
          }
        });
        mapBlock.to.location = mapBlock.to.location[0];
      }
    });
    if (!isFlat) {
      return this.flatLocations(mappedData);
    }
    return mappedData;
  }

  private findOneWayPoints() {
    const oneWayPoints = [];
    this.mappedData.forEach(data => {
      const foundFromPoint = this.mappedData.find(
        fromData => fromData.from.id === data.to.id
      );
      if (!foundFromPoint) {
        oneWayPoints.push({
          from: data.to
        });
      }
    });
    return oneWayPoints;
  }

  private mapData() {
    const mappedData = this.data.dataTransfers.map(transfer => {
      return {
        from: this.getMapBlock(transfer.sourceBlockId),
        to: this.getMapBlock(transfer.targetBlockId)
      };
    });
    this.mappedData = this.flatLocations(mappedData);
    const oneWayPoints = this.findOneWayPoints();
    this.mappedData.push(...oneWayPoints);
  }
}
