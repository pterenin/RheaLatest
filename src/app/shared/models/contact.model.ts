import { LocationInterface } from './location.model';

export type ContactType = string;

interface DimAccountInterface {
  id: string;
}

export interface CreatorInterface {
  dimAccount: DimAccountInterface;
  id: string;
}

export interface PersonInterface {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserCreatorInterface
  extends CreatorInterface,
    PersonInterface {
  status: string;
  version: number;
}

export interface ContactInterface extends PersonInterface {
  aaaUserId: string;
  address: string;
  city: string;
  id: string;
  location: LocationInterface;
  phone: string;
  version: number;
  zip: string;
}
