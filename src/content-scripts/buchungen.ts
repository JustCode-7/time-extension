import { sleep } from '../shared/sync.util';
import { Buchungen, Navbar } from './elements.cs';


/**
 * CSV / Objekt structure:
 * (Buchungsobjekt)
 *
 *  #  accessor      Visual-Time  Bsp.      Note
 *   0 date          DATUM        12.03
 *   1 dayOfWeek     TAG          Mo
 *   2 info          INFO                   ** gelöscht   ++ relative Korrektur   == Absolute Korrektur   * Feiertag   FK Fehlerbuchung
 *   3 arrivalTime   KOMMEN       9:33      = ARRIVAL_TIME
 *   4 leaveTime     GEHEN        18:05     = LEAVE_TIME   oder *=gelöscht
 *   5 tagIst        TAG_IST      +08:02
 *   6 tagSoll       TAG_SOLL     +07:48    = DEFAULT_WORKING_TIME
 *   7 tagSaldo      TAG_SALDO    +00:14    = TAG_IST - TAG_SOLL
 *   8 monatSumme    MONAT_SUMME  +03:22
 *   9 monatSoll     MONAT_SOLL   +12:12
 *  10 balance       MONAT_SALDO  -00:22    = MONAT_SUMME - MONAT_SOLL
 */
export interface BuchungItem {
  date: string; // eg. 12.03
  dayOfWeek: string;
  info: string;
  arrivalTime: string;
  leaveTime: string;
  tagIst: string;
  tagSoll: string;
  tagSaldo: string;
  monatSumme: string;
  monatSoll: string;
  balance: string;
}

export const BuchungsExtractor = new class {

  private readonly VALUE_SEPARATOR = ';';
  private readonly LINE_SEPARATOR = '\n';

  async getBuchungen(): Promise<BuchungItem[]> {

    if (!Navbar.buchungen.element || !Buchungen.table.element) {
      return [];
    }

    Navbar.buchungen.element.click();

    while (!Buchungen.table.element) {
      await sleep(10);
    }
    await sleep(100); // wait until table is fully-loaded // TODO this maybe obsolete if we wait until content-frame is ready. This has to be manually analyzed.

    const table = Buchungen.table.element;
    return BuchungsExtractor.extractValues(table.innerHTML);

  }


  /**
   *
   * @param rawHtml
   * @returns array of Buchungsobjekten
   */
  private extractValues(rawHtml: string) {
    const csv = BuchungsExtractor.toCSV(rawHtml);
    return BuchungsExtractor.mapToBuchungItems(csv);
  }

  /**
   *
   * @param array of Buchungsobjekten
   */
  private extractBalance(array: BuchungItem[]) {
    return array[array.length - 1].balance;
  }

  /**
   * Extract the arrivalTime for a given Day
   *
   * @param array of Buchungsobjekten
   * @param date
   * @returns arrivalTime of given `date` or null
   */
  private extractArrivalTime(array: BuchungItem[], date: string): string | null {
    const entries = array.filter((e: BuchungItem) => e.date === date);
    return entries.length > 0 ? entries[0].arrivalTime : null;
  }

  /**
   * Strip the rawHtml and sort out unnecessary values
   *
   * @param {string} rawHtml
   *
   * @returns {string[]} csv
   */
  private toCSV(rawHtml: string): string[] {
    return this.stripHtml(rawHtml)
      .split(this.LINE_SEPARATOR)
      .filter((line) =>
        line.length > 0 &&
        !line.startsWith('Wochenwerte') &&
        !line.startsWith('Monatsabschluss') &&
        !line.startsWith('Übertrag') &&
        !line.includes('Sa') && // TODO this may be relevant (eg. Release-WE) ??
        !line.includes('So'),
      );
  }

  /**
   * Remove unnecessary whitespace, tags and attributes.
   *
   * @param rawHtml
   * @param valueSeparator, default= ;
   * @param lineSeparator, default= \n
   *
   * @return a stripped html string
   *
   * @private
   */
  private stripHtml(rawHtml: string,
                    valueSeparator = this.VALUE_SEPARATOR,
                    lineSeparator = this.LINE_SEPARATOR,
  ): string {

    return rawHtml
      // Whitespace
      .replace(/\s/g, '')
      .replace(/&nbsp;/g, '')

      // Attributes
      .replace(/title="[^"]*"/g, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/style="[^"]*"/g, '')
      .replace(/width="[^"]*"/g, '')
      .replace(/href="[^"]*"/g, '')
      .replace(/align="center"/g, '')
      .replace(/colspan="[^"]+"/g, '')

      // Tags
      .replace(/<[/]?(a|b|font|p)>/g, '')
      .replace(/<[/]?tbody>/, '')
      .replace(/<tr>/, '')
      .replace(/<td>/, '')
      .replace(/<[/]td>/, valueSeparator)
      .replace(/<[/]tr>/, lineSeparator);
  }

  /**
   * Map the csv to BuchungsItems
   *
   * @param {string[]} csv
   * @returns {BuchungItem[]}
   */
  private mapToBuchungItems(csv: string[]): BuchungItem[] {
    return csv
      .map((line: string) => {
        const values = line.split(this.VALUE_SEPARATOR);
        return {
          date: values[0],
          dayOfWeek: values[1],
          info: values[2],
          arrivalTime: values[3],
          leaveTime: values[4],
          tagIst: values[5],
          tagSoll: values[6],
          tagSaldo: values[7],
          monatSumme: values[8],
          monatSoll: values[9],
          balance: values[10],
        };
      });
  }
};
