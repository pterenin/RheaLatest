import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ta-custom-category-tag',
  templateUrl: './custom-category-tag.component.html',
  styleUrls: ['./custom-category-tag.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomCategoryTagComponent implements OnInit {
  @Input() innerText = 'C';
  constructor() {}

  ngOnInit() {}
}
