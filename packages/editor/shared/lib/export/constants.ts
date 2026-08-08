/**
 * Components folder an export writes into when a caller names none.
 *
 * The export route applies this default, and the editor needs the same value to
 * know which folder it just wrote, so both read it from here rather than
 * repeating the literal.
 */
export const DEFAULT_COMPONENTS_FOLDER = "sdn"
