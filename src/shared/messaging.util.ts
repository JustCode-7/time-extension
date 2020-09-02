import { BuchungItem } from '../content-scripts/buchungen';

export const RUNTIME_MESSAGE_PORT__CONTENT_SCRIPT = 'TIME_EXTENSION_MESSAGE_PORT__CONTENT_SCRIPT';
export const RUNTIME_MESSAGE_PORT__POPUP = 'TIME_EXTENSION_MESSAGE_PORT__POPUP';

export interface GenericMessage {
  target: MessageTarget,
  realm: Realm,
  type: MessageType,
}

export enum MessageTarget {
  ContentScript = 'ContentScript',
  Background = 'Background',
  Popup = 'Popup',
}

export enum Realm {
  CONNECTION = 'CONNECTION',
  AUTH = 'AUTH',
  BUCHUNGEN = 'BUCHUNGEN',
}

type MessageType =
  | Connection.MessageType
  | Auth.MessageType
  | Buchungen.MessageType
  ;


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Connection {
  export interface TabConnectionStatus {
    isTabConnected: boolean;
  }

  export enum MessageType {
    CONNECT_TO_TAB = 'CONNECT_TO_TAB',
    CHECK_TAB_CONNECTION = 'CHECK_TAB_CONNECTION',
    TAB_CONNECTION_STATUS = 'TAB_CONNECTION_STATUS',
  }

  export class ConnectToTabMessage implements GenericMessage {
    target = MessageTarget.Background;
    realm = Realm.CONNECTION;
    type = MessageType.CONNECT_TO_TAB;
  }

  export class CheckTabConnectionMessage implements GenericMessage {
    target = MessageTarget.Background;
    realm = Realm.CONNECTION;
    type = MessageType.CHECK_TAB_CONNECTION;
  }

  export class TabConnectionStatusMessage implements GenericMessage {
    target = MessageTarget.Popup;
    realm = Realm.CONNECTION;
    type = MessageType.TAB_CONNECTION_STATUS;

    constructor(public tabConnectionStatus: TabConnectionStatus) {
    }
  }
}


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Auth {
  export const MAX_LOGIN_ATTEMPTS = 3;

  export interface Credentials {
    username: string,
    password: string,
  }

  export interface LoginResult {
    isLoggedIn: boolean;
  }

  export enum MessageType {
    LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
    CHECK_LOGIN_STATUS = 'CHECK_LOGIN_STATUS',
    LOGIN_RESULT = 'LOGIN_RESULT',
    LOGOUT = 'LOGOUT',
  }

  export class AttemptLoginMessage implements GenericMessage {
    target = MessageTarget.ContentScript;
    realm = Realm.AUTH;
    type = MessageType.LOGIN_ATTEMPT;

    constructor(public credentials: Credentials) {
    }
  }

  export class CheckLoginStatusMessage implements GenericMessage {
    target = MessageTarget.ContentScript;
    realm = Realm.AUTH;
    type = MessageType.CHECK_LOGIN_STATUS;
  }

  export class LoginResultMessage implements GenericMessage {
    target = MessageTarget.Popup;
    realm = Realm.AUTH;
    type = MessageType.LOGIN_RESULT;

    constructor(public loginResult: LoginResult) {
    }
  }

  export class LogoutMessage implements GenericMessage {
    target = MessageTarget.ContentScript;
    realm = Realm.AUTH;
    type = MessageType.LOGOUT;
  }
}


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Buchungen {

  export interface Buchungsliste {
    items: BuchungItem[];
  }

  export enum MessageType {
    BUCHUNGEN_EXTRACT = 'BUCHUNGEN_EXTRACT',
  }

  export class ExtractBuchungenMessage implements GenericMessage {
    target = MessageTarget.ContentScript;
    realm = Realm.BUCHUNGEN;
    type = MessageType.BUCHUNGEN_EXTRACT;
  }
}
