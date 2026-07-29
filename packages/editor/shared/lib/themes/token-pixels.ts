/**
 * Resolves theme length variables to pixels.
 *
 * A token is authored as a variable holding a rem string, so reading the custom property
 * hands back `0.25rem` rather than a number. Anything drawn by measurement rather than by
 * CSS needs the number, so a hidden probe takes the value as a real declaration and reads
 * back what the browser worked out. That covers rem, em, calc, and whatever a theme
 * switches to later, and it reads the value in the scope it is asked about, since the
 * variables are declared per theme.
 *
 * Read where the number is used rather than kept, so a theme change is picked up without
 * anything to invalidate. A name the theme does not declare reads as zero, since a
 * missing variable is not something to draw a guess for.
 *
 * @param tokens - Names to resolve, keyed by what each is for.
 * @param scope - An element inside the themed tree the values should be read from.
 */
export function getTokenPixels<TKey extends string>(
  tokens: Record<TKey, string>,
  scope: HTMLElement,
): Record<TKey, number> {
  const probe = document.createElement("span")

  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;height:0;"
  scope.appendChild(probe)

  const pixels = {} as Record<TKey, number>

  for (const key of Object.keys(tokens) as TKey[]) {
    probe.style.width = `var(${tokens[key]})`

    const width = Number.parseFloat(window.getComputedStyle(probe).width)

    pixels[key] = Number.isNaN(width) ? 0 : width
  }

  scope.removeChild(probe)

  return pixels
}
