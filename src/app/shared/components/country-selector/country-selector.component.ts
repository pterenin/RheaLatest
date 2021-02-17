import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationModalContentComponent } from 'src/app/shared/components/location-modal-content/location-modal-content.component';
import { CountryInterface } from 'src/app/shared/models/location.model';
import { TaModal } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss']
})
export class CountrySelectorComponent implements OnInit {
  @Input() public name: string;
  @Input() public type: string;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(private modalService: TaModal) {
    // default values will be overwritten when input value is provided.
    this.type = 'Data Subject Location';
    this.name = `{${this.type} name here}`;
  }

  public open(name = 'Name', type = 'Data Subject Location') {
    const modalRef = this.modalService.open(LocationModalContentComponent, {
      windowClass: 'ta-modal-location',
      size: 'md'
    });
    modalRef.componentInstance.type = this.type;
    modalRef.componentInstance.typeName = this.name;
    modalRef.componentInstance.showTabs = false;

    modalRef.result.then(
      (countries: CountryInterface[]) => {
        this.save.emit(countries);
      },
      cancelMessage => {
        this.cancel.emit();
      }
    );
  }

  ngOnInit() {}
}
