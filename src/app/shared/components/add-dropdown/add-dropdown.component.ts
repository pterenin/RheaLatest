import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ta-add-dropdown',
  templateUrl: './add-dropdown.component.html',
  styleUrls: ['./add-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddDropdownComponent {
  @Input() public dropdownID = 'addDropdown';
  constructor() {}
}

@Component({
  selector: 'ta-add-dropdown-item',
  template: `
    <ng-content></ng-content>
  `
})
@HostBinding('dropdown-item')
export class AddDropdownItemComponent {
  constructor() {}
}
