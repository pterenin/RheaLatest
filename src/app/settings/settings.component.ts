import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ta-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  constructor(
    public translate: TranslateService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
