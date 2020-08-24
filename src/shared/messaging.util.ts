import { BuchungItem } from '../content-scripts/buchungen';

export const RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT = 'TIME_EXTENSION_MESSAGE_PORT__CONTENT_SCRIPT';
export const RUNTIME_MESSAGE_PORT__POPUP = 'TIME_EXTENSION_MESSAGE_PORT__POPUP';

export interface GenericAction {
  realm: Realm;
  type: MessageType;
}

export enum Realm {
  GENERAL = 'GENERAL',
  AUTH = 'AUTH',
  BUCHUNGEN = 'BUCHUNGEN',
}

type MessageType =
  | General.MessageType
  | Auth.MessageType
  | Buchungen.MessageType
  ;


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Auth {
  export const MAX_LOGIN_ATTEMPTS = 3;

  export interface State {
    credentials: Credentials;
    loginStatus: LoginStatus;
  }

  export interface Credentials {
    username: string,
    password: string,
  }

  export interface LoginResult {
    isLoggedIn: boolean;
  }

  export interface LoginStatus {
    isLoggedIn: boolean;
    loginAttempts: number;
    isAccountLocked: boolean;
  }

  export enum MessageType {
    LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
    CHECK_LOGIN_STATUS = 'CHECK_LOGIN_STATUS',
    LOGIN_RESULT = 'LOGIN_RESULT',
    LOGIN_STATUS = 'LOGIN_STATUS',
  }

  export class AttemptLoginAction implements GenericAction {
    realm = Realm.AUTH;
    type = MessageType.LOGIN_ATTEMPT;

    constructor(public credentials: Credentials) {
    }
  }

  export class CheckLoginStatusAction implements GenericAction {
    realm = Realm.AUTH;
    type = MessageType.CHECK_LOGIN_STATUS;
  }

  export class LoginResultAction implements GenericAction {
    realm = Realm.AUTH;
    type = MessageType.LOGIN_RESULT;

    constructor(public loginResult: LoginResult) {
    }
  }

  export class LoginStatusAction implements GenericAction {
    realm = Realm.AUTH;
    type = MessageType.LOGIN_STATUS;

    constructor(public loginStatus: LoginStatus) {
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Buchungen {

  export interface Buchungsliste {
    items: BuchungItem[];
  }

  export enum MessageType {
    BUCHUNGEN_GET = 'BUCHUNGEN_GET',
  }

  export class ExtractAction implements GenericAction {
    realm = Realm.BUCHUNGEN;
    type = MessageType.BUCHUNGEN_GET;
  }
}


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace General {
  export interface TabConnectionStatus {
    isTabConnected: boolean;
  }

  export enum MessageType {
    CONNECT_TO_TAB = 'CONNECT_TO_TAB',
    CHECK_TAB_CONNECTION = 'CHECK_TAB_CONNECTION',
    TAB_CONNECTION_STATUS = 'TAB_CONNECTION_STATUS',
  }

  export class ConnectToTabAction implements GenericAction {
    realm = Realm.GENERAL;
    type = MessageType.CONNECT_TO_TAB;
  }

  export class CheckTabConnectionAction implements GenericAction {
    realm = Realm.GENERAL;
    type = MessageType.CHECK_TAB_CONNECTION;
  }

  export class TabConnectionStatusAction implements GenericAction {
    realm = Realm.GENERAL;
    type = MessageType.TAB_CONNECTION_STATUS;

    constructor(public tabConnectionStatus: TabConnectionStatus) {
    }
  }
}
