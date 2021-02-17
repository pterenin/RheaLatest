import { CyAPI } from '../../../shared';

export module BuildDataFlowAPI {
  export interface API {
    putItSystemNodes: CyAPI;
    getDataTransfersMap: CyAPI;
  }
}
