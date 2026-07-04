/**
 * Families enabled by default when the Google font collection is added to a
 * workspace. Every other Google family is seeded to `None` (all variants
 * disabled). Names match the `family` field in `google-fonts-manifest.ts`.
 */
export const GOOGLE_DEFAULT_ENABLED_FAMILIES: ReadonlySet<string> = new Set([
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Work Sans",
  "Nunito",
  "Nunito Sans",
  "Source Sans 3",
  "IBM Plex Sans",
  "DM Sans",
  "Figtree",
  "Manrope",
  "Merriweather",
  "Playfair Display",
  "Fraunces",
  "Lora",
  "Source Serif 4",
  "Noto Serif",
  "Roboto Mono",
  "IBM Plex Mono",
  "JetBrains Mono",
  "Source Code Pro",
  "Bebas Neue",
  "Anton",
  "Archivo",
  "Oswald",
  "Space Grotesk",
  "Sora",
  "Quicksand",
])
