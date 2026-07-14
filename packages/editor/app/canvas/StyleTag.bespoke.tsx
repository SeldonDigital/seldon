// BESPOKE-VIEW: hand-authored <style> injector for canvas CSS. 
// Pair with a portal to scope where it mounts.
interface StyleTagProps {
  css: string
  styleFor?: string
}

export function StyleTag({ css, styleFor }: StyleTagProps) {
  return <style data-seldon-style-for={styleFor}>{css}</style>
}
