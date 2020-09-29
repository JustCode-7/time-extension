import { GenericMessage } from './message.types';
import Port = chrome.runtime.Port;

export class Logger {

  static logMessage(message: GenericMessage, popupPort: Port | null, contentScriptPort: Port | null): void {
    const { target, realm, type } = message;
    console.groupCollapsed(`Action received ${target}.${realm}.${type}`);
    console.log('PopupPort', popupPort?.name);
    console.log('ContentScriptPort', contentScriptPort?.name);
    console.log(message);
    console.groupEnd();
  }

  static logIncomingMessage(source: 'ContentScript' | 'Background' | 'Popup', message: GenericMessage): void {
    this.log('[', source, '] Action received', message.realm + '.' + message.type, message);
  }

  static logUnimplementedMessageCase(message: GenericMessage): void {
    this.logUnimplementedCase(`${message.realm}.${message.type}`, message);
  }

  static logUnimplementedCase(caseName: string, ...extras: unknown[]): void {
    this.error('Unimplemented case for ', caseName, extras);
  }

  static info(msg: string, ...optionalParams: unknown[]): void {
    console.info('ℹ', msg, ...optionalParams);
  }

  static log(msg: string, ...optionalParams: unknown[]): void {
    console.log(msg, ...optionalParams);
  }

  static error(msg: string, ...optionalParams: unknown[]): void {
    console.error('💥', msg, ...optionalParams);
  }
}
