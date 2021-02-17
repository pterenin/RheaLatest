import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ta-business-process-wizard',
  templateUrl: './business-process-wizard.component.html',
  styleUrls: ['./business-process-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessProcessWizardComponent implements OnInit, OnDestroy {
  constructor() {}

  async ngOnInit(): Promise<void> {
    this.addBodyClass();
  }

  ngOnDestroy(): void {
    this.removeBodyClass();
  }

  private addBodyClass() {
    const element = document.querySelector('body');
    element.classList.add('systems-selections');
  }

  private removeBodyClass() {
    const element = document.querySelector('body');
    element.classList.remove('systems-selections');
  }
}
