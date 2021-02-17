import { Component, OnInit, ViewEncapsulation } from '@angular/core';

export interface EntityTypeElement {
  name: string;
  color: string;
}

export const Entity = {
  // [i18n-tobeinternationalized]
  DATA_SUBJECT: { name: 'Data\nSubject', color: '#ffab00' },
  // [i18n-tobeinternationalized]
  IT_SYSTEM_3RD_PARTY: { name: `System\n(3rd Party)`, color: '#6554c0' },
  // [i18n-tobeinternationalized]
  IT_SYSTEM_1ST_PARTY: { name: `System\n(1st Party)`, color: '#5fc323' },
  // [i18n-tobeinternationalized]
  DATA_RECIPIENT: { name: 'Data\nRecipient', color: '#ff5630' }
};

export const MultiEntity = {
  type: 'MULTI_ENTITY',
  value: 'Multiple\nEntities',
  color: '#2c84fd'
};
@Component({
  selector: 'ta-highcharts-container',
  templateUrl: './highcharts-container.component.html',
  styleUrls: ['./highcharts-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HighchartsContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
