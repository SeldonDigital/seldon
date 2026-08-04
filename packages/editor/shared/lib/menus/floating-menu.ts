/** Matches the floating menu and combobox list surfaces that portal out of a card. */
export const MENU_SURFACE_SELECTOR = '[role="menu"],[role="listbox"]'

/**
 * True when a press landed inside a floating menu or combobox list. These surfaces portal
 * to `document.body`, so a card that dismisses on an outside press must treat a press on
 * one as its own, or picking an option would close the card and drop the selection.
 */
export function isInsideMenuSurface(target: EventTarget | null): boolean {
  const el =
    target instanceof Element ? target : target instanceof Node ? target.parentElement : null

  return el?.closest(MENU_SURFACE_SELECTOR) != null
}
