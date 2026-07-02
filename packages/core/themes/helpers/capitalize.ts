/** Uppercases the first character of a token or look id for display labels. */
export function capitalize(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1)
}
