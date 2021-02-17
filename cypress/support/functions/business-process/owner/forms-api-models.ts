import { CyAPI } from './../../shared/models-api';

export module BusinessProcessAPI {
  export interface CRUD {
    create: CyAPI;
    read: CyAPI;
    update: CyAPI;
    delete: CyAPI;
  }

  export interface Owner {
    putOwner: CyAPI;
  }
}
