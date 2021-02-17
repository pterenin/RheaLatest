import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[taDebounceClick]'
})
export class DebounceClickDirective implements OnInit {
  @Output() debounceClick = new EventEmitter();
  @Input() debounceTime = 400;
  public clicks = new Subject();

  constructor() {}

  ngOnInit() {
    this.clicks.pipe(debounceTime(this.debounceTime)).subscribe((e = {}) => {
      this.debounceClick.emit(e);
    });
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
