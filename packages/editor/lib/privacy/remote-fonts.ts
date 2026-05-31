const REMOTE_FONTS_ENV_VALUE = "true"

const SYSTEM_FONT_FAMILIES = new Set([
  "inherit",
  "initial",
  "monospace",
  "sans-serif",
  "serif",
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
  "unset",
])

export function shouldLoadRemoteFonts(): boolean {
  return (
    process.env.NEXT_PUBLIC_SELDON_ENABLE_REMOTE_FONTS ===
    REMOTE_FONTS_ENV_VALUE
  )
}

export function isRemoteFontFamilyCandidate(font: string): boolean {
  const normalized = font.trim()

  return (
    normalized.length > 0 &&
    normalized.length <= 120 &&
    !normalized.startsWith("@") &&
    !normalized.includes(",") &&
    !SYSTEM_FONT_FAMILIES.has(normalized.toLowerCase())
  )
}

export function shouldLoadRemoteFont(font: string): boolean {
  return shouldLoadRemoteFonts() && isRemoteFontFamilyCandidate(font)
}
