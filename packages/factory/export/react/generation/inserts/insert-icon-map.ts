import { IconId } from "@seldon/core/icon-sets"
import { getIconComponentName } from "../../discovery/get-icon-component-name"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"

export function insertIconMap(
  source: string,
  usedIconIds: Set<IconId> | IconId[] | undefined,
) {
  let content = "const iconMap = {"

  if (usedIconIds) {
    // Convert to Set to deduplicate if it's an array
    const uniqueIconIds =
      usedIconIds instanceof Set ? usedIconIds : new Set(usedIconIds)

    for (const icon of uniqueIconIds) {
      const componentName = getIconComponentName(icon)
      const mapEntry = `"${icon}": Icons.${componentName}`
      content += `${mapEntry},\n`
    }
  }

  content += "}"

  return transformSource({
    strategy: TransformStrategy.APPEND,
    source,
    content,
  })
}
