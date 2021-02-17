import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ta-data-flow-chart-node',
  templateUrl: './data-flow-chart-node.component.html',
  styleUrls: ['./data-flow-chart-node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowChartNodeComponent implements OnInit {
  @Input() public node: any;

  constructor() {}

  public ngOnInit(): void {}

  public getNodeTypeText(nodeType: string): string {
    const textFirstSection = `${nodeType.charAt(0).toUpperCase()}${nodeType
      .slice(1)
      .toLowerCase()
      .replace('_', ' ')}`;

    const textSecondSection = textFirstSection
      .slice(textFirstSection.lastIndexOf(' '))
      .trim();

    return `${textFirstSection.replace(
      textSecondSection.toLowerCase(),
      ''
    )} ${textSecondSection.charAt(0).toUpperCase()}${textSecondSection.slice(
      1
    )}`;
  }
}
