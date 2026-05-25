/**
 * Get the component id from a class name by removing the last dash and the part that comes after it
 * @param className - The class name to get the component id from
 * @returns The component id
 */
export function getComponentIdFromClassName(className: string) {
  return className.split("-").slice(0, -1).join("-")
}
