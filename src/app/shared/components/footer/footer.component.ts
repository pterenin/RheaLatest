import { Component, OnInit } from '@angular/core';
import { FOOTER_LINKS } from './footer.constant';

@Component({
  selector: 'ta-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public aboutLink: any;
  public privacyLink: any;
  public supportLink: any;
  public contactLink: any;
  public feedbackLink: any;
  public fullYear: number;

  constructor() {
    this.aboutLink = FOOTER_LINKS.ABOUT;
    this.privacyLink = FOOTER_LINKS.PRIVACY;
    this.supportLink = FOOTER_LINKS.SUPPORT;
    this.contactLink = FOOTER_LINKS.CONTACT;
    this.feedbackLink = FOOTER_LINKS.FEEDBACK;
    this.fullYear = new Date().getFullYear();
  }

  ngOnInit() {}
}
