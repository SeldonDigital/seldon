/**
 * Rounds a number to a specified precision.
 *
 * @param value - The number to round
 * @param precision - The number of decimal places (default: 3)
 * @returns The rounded number
 */
export function round(value: number, precision: number = 3) {
  return Math.round(value * 10 ** precision) / 10 ** precision
}
