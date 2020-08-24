export class Frame {
  constructor(public frameName: string) {
  }

  public get document(): Document {
    return this.getNestedDom(this.frameName);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns the document of this Frame
   *
   * @param frameName {string}
   * @return {Document}
   * @throws error if frame was not found
   */
  private getNestedDom(frameName: string): Document {
    // const frame: HTMLFrameElement = document.getElementsByName(frameName)[0] as HTMLFrameElement;
    // const dom = frame?.contentWindow?.document;
    const dom: Document = window[frameName as never]?.document;

    if (dom) return dom;
    else throw new Error(`Frame #${frameName} not found.`);
  }
}


interface Constraints {
  size?: number;
  maxlength?: number;
}

class Element<T extends HTMLElement> {
  constructor(public frame: Frame,
              public id: string,
              public label: string = '',
              public constraints: Constraints = {},
  ) {
  }

  public get element(): T | null {
    return this.getHTMLElement(this.id);
  }

  public getNthElement(n: number): T | null {
    return this.getHTMLElement(this.id + n);
  }

  private getHTMLElement(id: string): T | null {
    const el: HTMLElement | null = this.frame.document.getElementById(id);

    return el ? el as T : null;
  }
}


export class Header {
  static frame = new Frame('headerframe');

  static bitteAnmelden = new Element<HTMLDivElement>(Header.frame, 'DIV1_de', 'Bitte anmelden !');
}

export class Navbar {
  static frame = new Frame('menuframe');

  static personaldaten = new Element<HTMLDivElement>(Navbar.frame, 'do_3', 'Personaldaten');
  static ausweisverwaltung = new Element<HTMLDivElement>(Navbar.frame, 'do_7', 'Ausweisverwaltung');
  static urlaubskonten = new Element<HTMLDivElement>(Navbar.frame, 'do_11', 'Urlaubskonten');
  static jahresblatt = new Element<HTMLDivElement>(Navbar.frame, 'do_15', 'Jahresblatt');
  static buchungen = new Element<HTMLDivElement>(Navbar.frame, 'do_19', 'Buchungen');
  static workflow = new Element<HTMLDivElement>(Navbar.frame, 'do_31', 'Workflow');
  static buchen = new Element<HTMLDivElement>(Navbar.frame, 'do_35', 'Buchen');
  static fehlzeit = new Element<HTMLDivElement>(Navbar.frame, 'do_39', 'Fehlzeit');
  static dienste = new Element<HTMLDivElement>(Navbar.frame, 'do_51', 'Dienste');
  static informationen = new Element<HTMLDivElement>(Navbar.frame, 'do_55', 'Informationen Lesen');
  static changePassword = new Element<HTMLDivElement>(Navbar.frame, 'do_67', 'Passwort aendern');
  static logout = new Element<HTMLDivElement>(Navbar.frame, 'do_79', 'Abmelden');
}

export class Content {
  static frame = new Frame('mainframe');
}

export class Login {
  static usernameInput = new Element<HTMLInputElement>(Content.frame, 'userid', 'Benutzername', { size: 20, maxlength: 40 });
  static passwordInput = new Element<HTMLInputElement>(Content.frame, 'USER_PASS', 'Passwort', { size: 20, maxlength: 16 });
  static loginBtn = new Element<HTMLLinkElement>(Content.frame, 'anmeldebutton_de', 'Anmelden');
}

export class Urlaubskonten {
  // TODO add elements
}

export class Buchungen {
  // TODO add elements
  static table = new Element<HTMLTableElement>(Content.frame, 'ScrollTable');
}

export class Buchen {
  static speichern = new Element<HTMLLinkElement>(Content.frame, 'SAVE', 'Speichern');
  static buchungsart = new Element<HTMLSelectElement>(Content.frame, 'ART', 'Buchungsart');
  static datum = new Element<HTMLInputElement>(Content.frame, 'DATUM', 'Datum');
  static von = new Element<HTMLInputElement>(Content.frame, 'ZEITVON', 'Von');
  static bis = new Element<HTMLInputElement>(Content.frame, 'ZEITBIS', 'Bis');
}

export class Fehlzeit {
  // TODO add elements
}
