import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ta-system-record-none-component',
  templateUrl: './system-record-none.component.html',
  styleUrls: ['./system-record-none.component.scss']
})
export class SystemRecordNoneComponent implements OnInit {
  @Output() public addSystem = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public handleAddSystem() {
    this.addSystem.emit('ADD_SYSTEM');
  }
}
