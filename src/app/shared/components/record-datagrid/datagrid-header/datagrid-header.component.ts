import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ta-datagrid-header',
  templateUrl: './datagrid-header.component.html',
  styleUrls: ['./datagrid-header.component.scss']
})
export class DatagridHeaderComponent {
  @Input() public gridId: string;

  constructor(public translate: TranslateService) {}

  public assignNewBusinessProcessClicked() {
    console.log('assign new business process clicked');
  }
}
