export function formatLabelFromCatalogId(
  catalogId: string,
  fallback: string,
): string {
  if (!catalogId) return fallback
  return (
    catalogId.charAt(0).toUpperCase() +
    catalogId.slice(1).replace(/[-_]/g, " ")
  )
}
