import { defineStore } from "pinia"
import { ref, watch } from "vue"

const STORAGE_KEY = "properties-expansion"

interface PersistedExpansion {
  categories?: Record<string, boolean>
  properties?: Record<string, boolean>
}

function loadState(): PersistedExpansion {
  if (typeof localStorage === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PersistedExpansion
  } catch {
    return {}
  }
}

/**
 * Category and compound/shorthand row expansion for the properties sidebar,
 * persisted to localStorage. Categories default to expanded, so the store only
 * tracks explicit collapses. Compound rows default to collapsed. Mirrors the
 * React `use-property-expansion` store.
 */
export const usePropertyExpansionStore = defineStore(
  "properties-expansion",
  () => {
    const persisted = loadState()
    const categories = ref<Record<string, boolean>>(persisted.categories ?? {})
    const properties = ref<Record<string, boolean>>(persisted.properties ?? {})

    function isCategoryExpanded(category: string): boolean {
      return categories.value[category] ?? true
    }

    function isPropertyExpanded(propertyKey: string): boolean {
      return properties.value[propertyKey] ?? false
    }

    function toggleCategory(category: string, shouldExpand?: boolean): void {
      const expand = shouldExpand ?? !isCategoryExpanded(category)
      categories.value = { ...categories.value, [category]: expand }
    }

    function toggleProperty(propertyKey: string, shouldExpand?: boolean): void {
      const expand = shouldExpand ?? !isPropertyExpanded(propertyKey)
      properties.value = { ...properties.value, [propertyKey]: expand }
    }

    watch(
      [categories, properties],
      () => {
        if (typeof localStorage === "undefined") return
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            categories: categories.value,
            properties: properties.value,
          }),
        )
      },
      { deep: false },
    )

    return {
      categories,
      properties,
      isCategoryExpanded,
      isPropertyExpanded,
      toggleCategory,
      toggleProperty,
    }
  },
)
