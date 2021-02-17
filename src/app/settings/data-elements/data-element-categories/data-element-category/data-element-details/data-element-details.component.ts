import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

@AutoUnsubscribe([
  '_eventRequestRef$',
  '_eventToggleRef$',
  '_getDataElementDetails$'
])
@Component({
  selector: 'ta-data-element-details',
  templateUrl: './data-element-details.component.html',
  styleUrls: ['./data-element-details.component.scss']
})
export class DataElementDetailsComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
