import { GenericAction } from './messaging.util';

export class Logger {

  static logIncomingAction(source: 'ContentScript' | 'Background' | 'Popup', action: GenericAction): void {
    console.log('[', source, '] Action received', action.realm + '.' + action.type, action);
  }

  static logMissingCase(action: GenericAction): void {
    console.error('Unimplemented case for ', action.realm + '.' + action.type, action);
  }
}
