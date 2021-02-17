import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { PageNavStepsInterface, PageRouteChange } from './page-nav.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationEventService } from '../../services/navigation/navigation-event.service';
import { from } from 'rxjs';

@Component({
  selector: 'ta-page-nav',
  templateUrl: './page-nav.component.html',
  styleUrls: ['./page-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageNavComponent implements OnInit, OnChanges {
  @Input() steps: PageNavStepsInterface[];
  @Input() minimal: boolean;
  @Input() navigationEventService: NavigationEventService;

  @Input() selectedStep = 0;
  @Input() isReview = false;
  @Output() pageRouteChanged = new EventEmitter<PageRouteChange>();

  private stepList: PageNavStepsInterface[];
  public isMinimal: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.stepList = this.steps;
    this.isMinimal = this.minimal ? this.minimal : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.navigationEventService) {
      this.navigationEventService.emitChange('navigation');
    }
    if (changes.steps) {
      this.stepList = changes.steps.currentValue;
    }
  }

  navigateTo(url: string) {
    const navigationStream = from(
      this.router.navigate([url], { relativeTo: this.activatedRoute })
    );

    navigationStream.subscribe((routedSuccessfully: boolean) => {
      // A null response indicates we've navigated to the same url.
      // This is undocumented in https://angular.io/api/router/Router#navigate as of 2019-09-13
      if (routedSuccessfully === true || routedSuccessfully === null) {
        this.pageRouteChanged.emit({ success: true, url });
      } else {
        console.error('Unable to route to: ', url);
        this.pageRouteChanged.emit({ success: false });
      }
    });
  }
}
