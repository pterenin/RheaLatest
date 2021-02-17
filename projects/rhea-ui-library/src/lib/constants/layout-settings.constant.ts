export const LayoutSettingsConstant = {
  Chart: {
    interactive: false,
    async: true,
    frozen: true,
    drawGrid: true,
    embeddingMode: true,
    clickThreshold: 5,
    highlighting: {
      default: {
        name: 'addClass',
        options: {
          className: 'active'
        }
      }
    }
  },
  Dagre: {
    rankDir: 'LR',
    align: null,
    edgeSep: 80,
    rankSep: 80,
    ranker: 'network-simplex',
    nodeSep: 20,
    showGroups: true
  },
  BlockElement: {
    padding: {
      vertical: 30,
      horizontal: 40
    }
  },
  ItSystems: {
    width: 178,
    height: 146
  },
  NonItSystems: {
    width: 160,
    height: 75
  }
};
