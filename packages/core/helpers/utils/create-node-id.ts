import { customAlphabet } from "nanoid"

/**
 * Generates a unique 8-character node ID using alphanumeric characters.
 * @returns A unique node identifier string
 */
export function createNodeId() {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  )

  return nanoid(8)
}
