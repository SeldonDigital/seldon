const COLON = ":"

function splitTemplateRef(value: string): { prefix: string; suffix: string } | null {
  const first = value.indexOf(COLON)
  const last = value.lastIndexOf(COLON)

  // Strict `{prefix}:{suffix}` grammar.
  if (first <= 0 || first === value.length - 1 || first !== last) {
    return null
  }

  return { prefix: value.slice(0, first), suffix: value.slice(first + 1) }
}

export type ParsedNodeTemplateRef =
  | { kind: "catalog"; componentId: string }
  | { kind: "node"; nodeId: string }

export type ParsedNodeTemplate = ParsedNodeTemplateRef

export type ParsedThemeTemplateRef =
  | { kind: "catalog"; themeCatalogId: string }
  | { kind: "theme"; themeId: string }

export type ParsedThemeTemplate = ParsedThemeTemplateRef

export type ParsedFontCollectionTemplateRef =
  | { kind: "catalog"; fontCollectionCatalogId: string }
  | { kind: "font-collection"; fontCollectionId: string }

export type ParsedFontCollectionTemplate = ParsedFontCollectionTemplateRef

export function parseNodeTemplateRef(
  value: string,
): ParsedNodeTemplateRef | null {
  const parts = splitTemplateRef(value)
  if (!parts) {
    return null
  }
  if (parts.prefix === "catalog") {
    return { kind: "catalog", componentId: parts.suffix }
  }
  if (parts.prefix === "node") {
    return { kind: "node", nodeId: parts.suffix }
  }
  return null
}

export function parseNodeTemplate(value: string): ParsedNodeTemplateRef | null {
  return parseNodeTemplateRef(value)
}

export function parseThemeTemplateRef(
  value: string,
): ParsedThemeTemplateRef | null {
  const parts = splitTemplateRef(value)
  if (!parts) {
    return null
  }
  if (parts.prefix === "catalog") {
    return { kind: "catalog", themeCatalogId: parts.suffix }
  }
  if (parts.prefix === "theme") {
    return { kind: "theme", themeId: parts.suffix }
  }
  return null
}

export function parseThemeTemplate(value: string): ParsedThemeTemplateRef | null {
  return parseThemeTemplateRef(value)
}

export function formatNodeCatalogTemplateRef(componentId: string): string {
  return `catalog:${componentId}`
}

export function formatNodeCatalog(componentId: string): string {
  return formatNodeCatalogTemplateRef(componentId)
}

export function formatNodeLinkTemplateRef(nodeId: string): string {
  return `node:${nodeId}`
}

export function formatNodeLink(nodeId: string): string {
  return formatNodeLinkTemplateRef(nodeId)
}

export function formatThemeCatalogTemplateRef(themeCatalogId: string): string {
  return `catalog:${themeCatalogId}`
}

export function formatThemeCatalog(themeCatalogId: string): string {
  return formatThemeCatalogTemplateRef(themeCatalogId)
}

export function formatThemeLinkTemplateRef(themeId: string): string {
  return `theme:${themeId}`
}

export function formatThemeLink(themeId: string): string {
  return formatThemeLinkTemplateRef(themeId)
}

export function parseFontCollectionTemplateRef(
  value: string,
): ParsedFontCollectionTemplateRef | null {
  const parts = splitTemplateRef(value)
  if (!parts) {
    return null
  }
  if (parts.prefix === "catalog") {
    return { kind: "catalog", fontCollectionCatalogId: parts.suffix }
  }
  if (parts.prefix === "font-collection") {
    return { kind: "font-collection", fontCollectionId: parts.suffix }
  }
  return null
}

export function parseFontCollectionTemplate(
  value: string,
): ParsedFontCollectionTemplateRef | null {
  return parseFontCollectionTemplateRef(value)
}

export function formatFontCollectionCatalogTemplateRef(
  fontCollectionCatalogId: string,
): string {
  return `catalog:${fontCollectionCatalogId}`
}

export function formatFontCollectionCatalog(
  fontCollectionCatalogId: string,
): string {
  return formatFontCollectionCatalogTemplateRef(fontCollectionCatalogId)
}

export function formatFontCollectionLinkTemplateRef(
  fontCollectionId: string,
): string {
  return `font-collection:${fontCollectionId}`
}

export function formatFontCollectionLink(fontCollectionId: string): string {
  return formatFontCollectionLinkTemplateRef(fontCollectionId)
}

export function parseNodeCatalogTemplateRef(
  value: string,
): Extract<ParsedNodeTemplateRef, { kind: "catalog" }> | null {
  const p = parseNodeTemplateRef(value)
  return p?.kind === "catalog" ? p : null
}

export function parseNodeCatalog(
  value: string,
): Extract<ParsedNodeTemplateRef, { kind: "catalog" }> | null {
  return parseNodeCatalogTemplateRef(value)
}

export function parseNodeLinkTemplateRef(
  value: string,
): Extract<ParsedNodeTemplateRef, { kind: "node" }> | null {
  const p = parseNodeTemplateRef(value)
  return p?.kind === "node" ? p : null
}

export function parseNodeLink(
  value: string,
): Extract<ParsedNodeTemplateRef, { kind: "node" }> | null {
  return parseNodeLinkTemplateRef(value)
}

export function parseThemeCatalogTemplateRef(
  value: string,
): Extract<ParsedThemeTemplateRef, { kind: "catalog" }> | null {
  const p = parseThemeTemplateRef(value)
  return p?.kind === "catalog" ? p : null
}

export function parseThemeCatalog(
  value: string,
): Extract<ParsedThemeTemplateRef, { kind: "catalog" }> | null {
  return parseThemeCatalogTemplateRef(value)
}

export function parseThemeLinkTemplateRef(
  value: string,
): Extract<ParsedThemeTemplateRef, { kind: "theme" }> | null {
  const p = parseThemeTemplateRef(value)
  return p?.kind === "theme" ? p : null
}

export function parseThemeLink(
  value: string,
): Extract<ParsedThemeTemplateRef, { kind: "theme" }> | null {
  return parseThemeLinkTemplateRef(value)
}

export function getNodeTemplateComponentId(value: string): string | null {
  return parseNodeCatalogTemplateRef(value)?.componentId ?? null
}

export function getNodeTemplateNodeId(value: string): string | null {
  return parseNodeLinkTemplateRef(value)?.nodeId ?? null
}

export function getThemeTemplateCatalogId(value: string): string | null {
  return parseThemeCatalogTemplateRef(value)?.themeCatalogId ?? null
}

export function getThemeTemplateThemeId(value: string): string | null {
  return parseThemeLinkTemplateRef(value)?.themeId ?? null
}

export function parseFontCollectionCatalogTemplateRef(
  value: string,
): Extract<ParsedFontCollectionTemplateRef, { kind: "catalog" }> | null {
  const p = parseFontCollectionTemplateRef(value)
  return p?.kind === "catalog" ? p : null
}

export function parseFontCollectionLinkTemplateRef(
  value: string,
): Extract<ParsedFontCollectionTemplateRef, { kind: "font-collection" }> | null {
  const p = parseFontCollectionTemplateRef(value)
  return p?.kind === "font-collection" ? p : null
}

export function getFontCollectionTemplateCatalogId(
  value: string,
): string | null {
  return (
    parseFontCollectionCatalogTemplateRef(value)?.fontCollectionCatalogId ?? null
  )
}

export function getFontCollectionTemplateFontCollectionId(
  value: string,
): string | null {
  return parseFontCollectionLinkTemplateRef(value)?.fontCollectionId ?? null
}
