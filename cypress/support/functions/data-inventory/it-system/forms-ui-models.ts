export interface CyDescription {
  selector: string;
  alias: string;
}

export interface Contact {
  fullName: CyDescription;
  email: CyDescription;
  phone: CyDescription;
  country: CyDescription;
  state: CyDescription;
  city: CyDescription;
  zipCode: CyDescription;
  address: CyDescription;
}

export module ITSystem {
  export interface ITSystemDetail {
    systemName: CyDescription;
    ownedBy: CyDescription;
    description: CyDescription;
    hostingLocations: CyDescription;
    dataSubjects: CyDescription;
    volumeOfDataSubjectRecords: CyDescription;
    contact: Contact;
    notes: CyDescription;
    companyAffiliate: {
      emailAddress: CyDescription;
      emailAddressErrorMessage: CyDescription;
    };
  }
}
