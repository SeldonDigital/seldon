/**
 * Text casing values for text transformation.
 */
export enum TextCasing {
  NORMAL = "normal",
  LOWERCASE = "lowercase",
  UPPERCASE = "uppercase",
  CAPITALIZE = "capitalize",
}

/**
 * Readable text case options for interface.
 */
export const TEXT_CASE_OPTIONS: { value: TextCasing; name: string }[] = [
  { value: TextCasing.NORMAL, name: "Normal" },
  { value: TextCasing.LOWERCASE, name: "Lowercase" },
  { value: TextCasing.UPPERCASE, name: "Uppercase" },
  { value: TextCasing.CAPITALIZE, name: "Capitalize" },
]
