import { CyAPI } from '../../../shared';

export module BusinessProcessAPI {
  export interface CRUD {
    create: CyAPI;
    read: CyAPI;
    update: CyAPI;
    delete: CyAPI;
    putOwner: CyAPI;
  }
}
