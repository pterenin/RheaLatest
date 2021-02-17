import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterContentChecked
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { getErrorMessageNoPermissionsToViewRecord } from '../../shared/utils/error-utils';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { BusinessProcessInterface } from '../create-bp/create-business-processes.model';
import { ToastService } from '@trustarc/ui-toolkit';

@AutoUnsubscribe(['_paramMap$'])
@Component({
  selector: 'ta-view-bp',
  templateUrl: './view-bp.component.html',
  styleUrls: ['./view-bp.component.scss']
})
export class ViewBpComponent implements AfterContentChecked, OnInit, OnDestroy {
  public baseDomainId: string;
  public totalAssessments = 0;
  public businessProcess: BusinessProcessInterface;
  private _paramMap$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessProcessService: BusinessProcessService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this._paramMap$ = getRouteParamObservable(
      this.route.paramMap,
      'id'
    ).subscribe(id => {
      this.baseDomainId = id;

      this.businessProcessService.get(id).subscribe(
        business => {
          this.businessProcess = business;
          this.editLastBreadcrumb(business.name);
        },
        err => {
          const { status } = err;
          if (status === 404 || status === 403) {
            const message = getErrorMessageNoPermissionsToViewRecord();
            return this.toastService.error(message, null, 5000);
          }
          console.error(err);
        }
      );
    });
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() { }

  private editLastBreadcrumb(title) {
    document.querySelector(
      '.ta-breadcrumb .breadcrumb-item:last-child'
    ).textContent = title;
  }

  public finishedLoadAssessments(total) {
    this.totalAssessments = total;
  }

  public download() {
    console.log('download click');
  }

  public editBp() {
    this.router.navigate([`/business-process/${this.baseDomainId}`]);
  }
}
