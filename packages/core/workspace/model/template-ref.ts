const COLON = ":"

/** Splits a `{prefix}:{suffix}` template ref. Returns null for any other shape. */
function splitTemplateRef(
  value: string,
): { prefix: string; suffix: string } | null {
  const first = value.indexOf(COLON)
  const last = value.lastIndexOf(COLON)

  if (first <= 0 || first === value.length - 1 || first !== last) {
    return null
  }

  return { prefix: value.slice(0, first), suffix: value.slice(first + 1) }
}

export type ParsedNodeTemplate =
  | { kind: "catalog"; componentId: string }
  | { kind: "node"; nodeId: string }

export type ParsedThemeTemplate =
  | { kind: "catalog"; themeCatalogId: string }
  | { kind: "theme"; themeId: string }

export type ParsedFontCollectionTemplate =
  | { kind: "catalog"; fontCollectionCatalogId: string }
  | { kind: "font-collection"; fontCollectionId: string }

export type ParsedIconSetTemplate =
  | { kind: "catalog"; iconSetCatalogId: string }
  | { kind: "icon-set"; iconSetId: string }

export function parseNodeTemplate(value: string): ParsedNodeTemplate | null {
  const parts = splitTemplateRef(value)
  if (!parts) return null
  if (parts.prefix === "catalog") {
    return { kind: "catalog", componentId: parts.suffix }
  }
  if (parts.prefix === "node") {
    return { kind: "node", nodeId: parts.suffix }
  }
  return null
}

export function parseNodeCatalog(
  value: string,
): Extract<ParsedNodeTemplate, { kind: "catalog" }> | null {
  const parsed = parseNodeTemplate(value)
  return parsed?.kind === "catalog" ? parsed : null
}

export function parseNodeLink(
  value: string,
): Extract<ParsedNodeTemplate, { kind: "node" }> | null {
  const parsed = parseNodeTemplate(value)
  return parsed?.kind === "node" ? parsed : null
}

export function formatNodeCatalog(componentId: string): string {
  return `catalog:${componentId}`
}

export function formatNodeLink(nodeId: string): string {
  return `node:${nodeId}`
}

export function parseThemeTemplate(value: string): ParsedThemeTemplate | null {
  const parts = splitTemplateRef(value)
  if (!parts) return null
  if (parts.prefix === "catalog") {
    return { kind: "catalog", themeCatalogId: parts.suffix }
  }
  if (parts.prefix === "theme") {
    return { kind: "theme", themeId: parts.suffix }
  }
  return null
}

export function formatThemeCatalog(themeCatalogId: string): string {
  return `catalog:${themeCatalogId}`
}

export function formatThemeLink(themeId: string): string {
  return `theme:${themeId}`
}

export function getThemeTemplateThemeId(value: string): string | null {
  const parsed = parseThemeTemplate(value)
  return parsed?.kind === "theme" ? parsed.themeId : null
}

/** Reduces a theme template ref to its bare catalog id or theme id, or returns the input unchanged. */
export function normalizeThemeTemplateRef(value: string): string {
  const parsed = parseThemeTemplate(value)
  if (parsed?.kind === "catalog") return parsed.themeCatalogId
  if (parsed?.kind === "theme") return parsed.themeId
  return value
}

function parseFontCollectionTemplate(
  value: string,
): ParsedFontCollectionTemplate | null {
  const parts = splitTemplateRef(value)
  if (!parts) return null
  if (parts.prefix === "catalog") {
    return { kind: "catalog", fontCollectionCatalogId: parts.suffix }
  }
  if (parts.prefix === "font-collection") {
    return { kind: "font-collection", fontCollectionId: parts.suffix }
  }
  return null
}

export function formatFontCollectionCatalog(
  fontCollectionCatalogId: string,
): string {
  return `catalog:${fontCollectionCatalogId}`
}

export function formatFontCollectionLink(fontCollectionId: string): string {
  return `font-collection:${fontCollectionId}`
}

export function getFontCollectionTemplateCatalogId(
  value: string,
): string | null {
  const parsed = parseFontCollectionTemplate(value)
  return parsed?.kind === "catalog" ? parsed.fontCollectionCatalogId : null
}

export function getFontCollectionTemplateFontCollectionId(
  value: string,
): string | null {
  const parsed = parseFontCollectionTemplate(value)
  return parsed?.kind === "font-collection" ? parsed.fontCollectionId : null
}

function parseIconSetTemplate(value: string): ParsedIconSetTemplate | null {
  const parts = splitTemplateRef(value)
  if (!parts) return null
  if (parts.prefix === "catalog") {
    return { kind: "catalog", iconSetCatalogId: parts.suffix }
  }
  if (parts.prefix === "icon-set") {
    return { kind: "icon-set", iconSetId: parts.suffix }
  }
  return null
}

export function formatIconSetCatalog(iconSetCatalogId: string): string {
  return `catalog:${iconSetCatalogId}`
}

export function formatIconSetLink(iconSetId: string): string {
  return `icon-set:${iconSetId}`
}

export function getIconSetTemplateCatalogId(value: string): string | null {
  const parsed = parseIconSetTemplate(value)
  return parsed?.kind === "catalog" ? parsed.iconSetCatalogId : null
}

export function getIconSetTemplateIconSetId(value: string): string | null {
  const parsed = parseIconSetTemplate(value)
  return parsed?.kind === "icon-set" ? parsed.iconSetId : null
}
