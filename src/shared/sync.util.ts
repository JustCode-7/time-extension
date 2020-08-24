/**
 * Create a synchronized delay
 *
 * Usage: await sleep(4200);
 *
 * @param ms {number} milliseconds
 * @returns {Promise<void>}
 */
export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
