export interface AuthInterface {
  token: Token;
  idtoken: Idtoken;
  signedIn: boolean;
  state: State;
  tokenInfo: TokenInfo;
}

export interface Idtoken {
  Idtoken: string;
}

export interface State {
  target_origin: string;
  proxy: string;
  state: string;
}

export interface Token {
  token: string;
  type: string;
  expiresIn: string;
}

export interface TokenInfo {
  accountId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  zoneInfo: string;
  locale: string;
}
