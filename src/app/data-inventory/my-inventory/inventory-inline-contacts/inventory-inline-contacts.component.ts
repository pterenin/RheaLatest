import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ta-inventory-inline-contacts',
  templateUrl: './inventory-inline-contacts.component.html',
  styleUrls: ['./inventory-inline-contacts.component.scss']
})
export class InventoryInlineContactsComponent implements OnInit {
  @Input() owners: any[];

  private cachedOpenPopovers = [];

  constructor() {}

  ngOnInit() {}

  public getOwnerNames() {
    return this.owners.map(owner => owner.fullName);
  }

  public triggerPopover(popover) {
    this.cachedOpenPopovers.push(popover);
    popover.open();
  }

  public closePopovers() {
    if (this.cachedOpenPopovers.length) {
      this.cachedOpenPopovers.forEach(pop => {
        if (pop) {
          pop.close();
        }
      });
      this.cachedOpenPopovers = [];
    }
  }
}
