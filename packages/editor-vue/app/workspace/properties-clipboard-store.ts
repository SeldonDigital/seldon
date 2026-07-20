import { defineStore } from "pinia"
import { ref } from "vue"

import { Properties } from "@seldon/core"

/**
 * Holds the property overrides currently copied from a node row in the objects
 * sidebar. A copy stores a snapshot of the source node's overrides; a paste
 * applies them onto the target node through `set_node_properties`. Mirrors the
 * React `use-properties-clipboard` store.
 */
export const usePropertiesClipboardStore = defineStore(
  "properties-clipboard",
  () => {
    const properties = ref<Properties | null>(null)

    function setProperties(next: Properties): void {
      properties.value = next
    }

    function clearProperties(): void {
      properties.value = null
    }

    return { properties, setProperties, clearProperties }
  },
)
