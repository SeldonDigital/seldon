import { computed, type ComputedRef } from "vue"
import { usePropertyExpansionStore } from "../property-expansion-store"
import type { PropertySection } from "../types"

/**
 * State and handlers for a category header. A plain click toggles the section;
 * an Alt/Option click cascades to every compound/shorthand row inside it. Vue
 * port of the React `useRowCategory`.
 */
export function useRowCategory(section: ComputedRef<PropertySection>) {
  const expansion = usePropertyExpansionStore()

  const isExpanded = computed(() =>
    expansion.isCategoryExpanded(section.value.category),
  )

  function onToggle(event?: MouseEvent): void {
    if (!event?.altKey) {
      expansion.toggleCategory(section.value.category)
      return
    }
    const shouldExpand = !isExpanded.value
    expansion.toggleCategory(section.value.category, shouldExpand)
    for (const property of section.value.properties) {
      if (property.isCompound || property.isShorthand) {
        expansion.toggleProperty(property.key, shouldExpand)
      }
    }
  }

  const icon = computed(() =>
    isExpanded.value ? "material-unfoldLess" : "material-unfoldMore",
  )
  const label = computed(() => section.value.label)

  return { isExpanded, onToggle, icon, label }
}
