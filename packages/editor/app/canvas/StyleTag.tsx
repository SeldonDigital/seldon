interface StyleTagProps {
  css: string
}

/** Injects a block of CSS text. Pair with a portal to scope where it mounts. */
export function StyleTag({ css }: StyleTagProps) {
  return <style>{css}</style>
}
