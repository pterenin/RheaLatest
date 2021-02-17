import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output
} from '@angular/core';

@Directive({
  selector: '[taDomWatch]'
})
export class DomWatchDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public taDomWatch = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) =>
        this.taDomWatch.emit(mutation)
      );
    });

    this.changes.observe(element, {
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
