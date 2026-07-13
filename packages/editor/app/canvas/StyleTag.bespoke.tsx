// BESPOKE-VIEW: hand-authored <style> injector for canvas CSS. Pair with a
// portal to scope where it mounts.
interface StyleTagProps {
  css: string
  /** Sets data-seldon-style-for so canvas styles can target a specific node. */
  styleFor?: string
}

/** Injects a block of CSS text. Pair with a portal to scope where it mounts. */
export function StyleTag({ css, styleFor }: StyleTagProps) {
  return <style data-seldon-style-for={styleFor}>{css}</style>
}
