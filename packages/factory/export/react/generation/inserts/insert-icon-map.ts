import { IconId } from "@seldon/core/icon-sets"

import { ExportOptions } from "../../../types"
import { resolveIconExport } from "../../utils/find-icon-path"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"

export function insertIconMap(
  source: string,
  usedIconIds: Set<IconId> | IconId[] | undefined,
  options: ExportOptions,
) {
  let content = "const iconMap = {"

  if (usedIconIds) {
    // Convert to Set to deduplicate if it's an array
    const uniqueIconIds =
      usedIconIds instanceof Set ? usedIconIds : new Set(usedIconIds)

    for (const icon of uniqueIconIds) {
      const resolved = resolveIconExport(icon, options.rootDirectory)
      // The map must stay total over the IconProps["icon"] union, so ids
      // without a catalog file fall back to the default icon instead of
      // referencing an export that was never emitted.
      const componentName = resolved?.componentName ?? "IconDefault"
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
