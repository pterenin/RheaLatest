import { CyAPI } from './../../shared/models-api';

export module BusinessProcessAPI {
  export interface CRUD {
    create: CyAPI;
    read: CyAPI;
    update: CyAPI;
    delete: CyAPI;
  }

  export interface Subjects {
    deleteDataSubject: CyAPI;
    deleteDataRecipient: CyAPI;
    postDataSubject: CyAPI;
    postDataRecipient: CyAPI;
    putDataSubject: CyAPI;
    putDataRecipient: CyAPI;
  }
}
