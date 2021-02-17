import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaModal } from '@trustarc/ui-toolkit';
import { CollaboratorModalComponent } from './collaborator-modal/collaborator-modal.component';

@Component({
  selector: 'ta-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollaboratorComponent implements OnInit {
  @Input() public title: string;
  @Input() public baseDomainId: any;

  constructor(private modalService: TaModal) {
    this.title = 'Invite Collaborator';
  }

  ngOnInit() {}

  invitedClick() {
    const modalRef = this.modalService.open(CollaboratorModalComponent, {
      windowClass: 'ta-modal-collaborator',
      centered: true,
      size: 'sm'
    });
    modalRef.componentInstance.baseDomainId = this.baseDomainId;
  }
}
