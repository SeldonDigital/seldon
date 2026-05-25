/**
 * Moves an item in an array to a new position.
 * @param array - The array to modify
 * @param itemId - The item to move
 * @param newIndex - The target index to move the item to
 */
export function moveItemInArray<T>(array: T[], itemId: T, newIndex: number) {
  const currentIndex = array.indexOf(itemId)

  if (currentIndex === newIndex) return

  array.splice(currentIndex, 1)
  array.splice(newIndex, 0, itemId)
}
