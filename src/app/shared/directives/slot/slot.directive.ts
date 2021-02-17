import {
  Directive,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { SlotService } from './slot.injectable';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

@AutoUnsubscribe(['_subscription$'])
@Directive({
  selector: '[taSlotContainer]'
})
export class SlotContainerDirective implements OnInit, OnDestroy {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private slotService: SlotService
  ) {}
  _subscription$: Subscription;

  ngOnInit() {
    this._subscription$ = this.slotService.aside$.subscribe(
      (template: TemplateRef<{}>) => {
        this.viewContainerRef.clear();
        this.viewContainerRef.createEmbeddedView(template);
      }
    );
  }

  ngOnDestroy() {}
}
