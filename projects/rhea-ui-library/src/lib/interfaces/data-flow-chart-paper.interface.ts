export interface DataFlowChartPaperInterface {
  el: HTMLElement;
  width: number;
  height: number;
  model: { [key: string]: any };
  interactive: boolean;
  async: boolean;
  frozen: boolean;
  gridSize: number;
  drawGrid: boolean;
  embeddingMode: boolean;
  clickThreshold: number;
  highlighting: { [key: string]: any };
  [key: string]: any;
}
