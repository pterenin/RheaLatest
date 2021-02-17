import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoleControllerService } from '../shared/services/user-role-controller/user-role-controller.service';

@Component({
  selector: 'ta-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss']
})
export class NoAccessComponent implements OnInit {
  constructor(
    private router: Router,
    private userRoleControllerService: UserRoleControllerService
  ) {}

  ngOnInit() {
    this.haveAppAccess();
  }

  private haveAppAccess() {
    if (!this.userRoleControllerService.getNoAppAccess) {
      this.router.navigate(['/']);
    }
  }
}
