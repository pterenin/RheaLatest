import { Directive, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { SlotService } from './slot.injectable';
import { Subscription, timer } from 'rxjs';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

// This directive is made to work similary to <ng-content select=''> but it works cross routes
// IMPORTANT: use <ng-content select=''> where it's possible instead.
// This component is made ONLY for cases when <ng-content select=''> does not work correctly
// (example would be cross routes use)

// usage:
// to show where you want to use slot use *taSlotContainer directive
//     <div *taSlotContainer></div>
// to place content inside the slot use *taSlotView directive
//     <div *taSlotView>This content will go inside the slot</div>

@AutoUnsubscribe(['_timer$'])
@Directive({
  selector: '[taSlotView]'
})
export class SlotViewDirective implements OnInit, OnDestroy {
  constructor(
    private slotService: SlotService,
    private templateRef: TemplateRef<any>
  ) {}
  private _timer$: Subscription;

  ngOnInit() {
    this._timer$ = timer(0).subscribe(() => {
      this.slotService.aside$.next(this.templateRef);
    });
  }

  ngOnDestroy() {}
}
