/**
 * Validates if a string is a valid HTTP/HTTPS URL.
 *
 * @param value - The string to validate
 * @returns True if the value is a valid URL
 */
export function isValidURL(value: string) {
  return /^(http|https):\/\/[^ "]+$/i.test(value)
}
