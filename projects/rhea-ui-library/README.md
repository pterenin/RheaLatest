# RheaUiLibrary

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

# Using the library

This library requires a dependencies of [Dagre](https://dagrejs.github.io), [Joint](https://www.jointjs.com), [Backbone](https://karma-runner.github.io), [jQuery](https://karma-runner.github.io), [Lodash](https://lodash.com/docs) and [Svg-Pan-Zoom](https://github.com/ariutta/svg-pan-zoom) to order to generate the data flow chart.

> Note: To install `npm install --save jquery lodash backbone dagre jointjs svg-pan-zoom`

```
$ npm install --save jquery lodash backbone dagre jointjs svg-pan-zoom
$ npm install --save-dev proj4 @types/geojson
$ npm install --save git+https://stash.truste.com/scm/ui/ta-rhea-ui-library.git#v1.1.1
```

## Include Scripts

In `angular.json` add this following in scripts scheme

```
"scripts": [
  "node_modules/jquery/dist/jquery.slim.min.js",
  "node_modules/lodash/lodash.min.js",
  "node_modules/backbone/backbone-min.js",
  "node_modules/dagre/dist/dagre.min.js",
  "node_modules/graphlib/dist/graphlib.min.js",
  "node_modules/jointjs/dist/joint.min.js",
  "node_modules/svg-pan-zoom/dist/svg-pan-zoom.min.js"
  ...
],
```

## Using Data Flow - Chart Component

Data flow chart contains `data` as input and `showDetails` as output. Input `data` accepts the interface of [DataFlowChartInterface](https://stash.truste.com/projects/RHEA/repos/rhea-ui/browse/projects/rhea-ui-library/src/lib/interfaces/data-flow-chart.interface.ts). Output `showDetails` emit the interface of [DataFlowShowDetails](https://stash.truste.com/projects/RHEA/repos/rhea-ui/browse/projects/rhea-ui-library/src/lib/interfaces/data-flow-show-details.interface.ts)

```
<ta-data-flow-chart
  [data]="dataFlowChart"
  (showDetails)="handleShowDetails($event)"
></ta-data-flow-chart>
```

## Using Data Flow - Map Component

Data flow chart contains `data` as input and `showDetails` as output. Input `data` accepts the interface of [DataFlowChartInterface](https://stash.truste.com/projects/RHEA/repos/rhea-ui/browse/projects/rhea-ui-library/src/lib/interfaces/data-flow-chart.interface.ts).

```
<ta-data-flow-map
  [data]="dataFlowChart"
></ta-data-flow-map>
```

# Updating the library

## Code scaffolding

Run `ng generate component component-name --project rhea-ui-library` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project rhea-ui-library`.

> Note: Don't forget to add `--project rhea-ui-library` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build rhea-ui-library` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build rhea-ui-library`, go to the dist folder `cd dist/rhea-ui-library` and run `npm publish`.

## Running unit tests

Run `ng test rhea-ui-library` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
