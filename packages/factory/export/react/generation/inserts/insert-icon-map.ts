import { resolveIconComponent } from "../../assets/resolve-icon-component"
import { TransformStrategy, transformSource } from "../../utils/transform-source"

import type { ExportOptions } from "../../../types"
import type { IconId } from "@seldon/core/icon-sets"

export function insertIconMap(
  source: string,
  usedIconIds: Set<IconId> | IconId[] | undefined,
  options: ExportOptions,
) {
  let content = "const iconMap = {"

  if (usedIconIds) {
    // Convert to Set to deduplicate if it's an array
    const uniqueIconIds = usedIconIds instanceof Set ? usedIconIds : new Set(usedIconIds)

    for (const icon of uniqueIconIds) {
      // One resolver for the map, index, and files: a data-backed id maps to
      // its synthesized component, and an unresolvable id maps to the emitted
      // `seldon-missing` glyph, so the map never references a missing export.
      const { componentName } = resolveIconComponent(icon, options)

      content += `"${icon}": Icons.${componentName},\n`
    }
  }

  content += "}"

  return transformSource({
    strategy: TransformStrategy.APPEND,
    source,
    content,
  })
}
