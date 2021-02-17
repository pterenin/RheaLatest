export interface SvgPanZoomInterface {
  viewportSelector?: string;
  panEnabled?: boolean;
  controlIconsEnabled?: boolean;
  zoomEnabled?: boolean;
  dblClickZoomEnabled?: boolean;
  mouseWheelZoomEnabled?: boolean;
  preventMouseEventsDefault?: boolean;
  zoomScaleSensitivity?: number;
  minZoom?: number;
  maxZoom: number;
  fit?: boolean;
  contain?: boolean;
  center?: boolean;
  refreshRate?: string;
  beforeZoom?: Function;
  onZoom?: Function;
  beforePan?: Function;
  onPan?: Function;
  onUpdatedCTM?: Function;
  customEventsHandler?: { [key: string]: any };
  eventsListenerElement?: SVGElement;
  [key: string]: any;
}
