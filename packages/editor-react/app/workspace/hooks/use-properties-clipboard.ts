import { create } from "zustand"

import { Properties } from "@seldon/core"

type PropertiesClipboardState = {
  properties: Properties | null
  setProperties: (properties: Properties) => void
  clearProperties: () => void
}

/**
 * Holds the property overrides currently copied from a node row in the objects
 * sidebar. A copy stores a snapshot of the source node's overrides; a paste
 * applies them onto the target node through `set_node_properties`.
 */
export const usePropertiesClipboard = create<PropertiesClipboardState>()(
  (set) => ({
    properties: null,
    setProperties: (properties) => set({ properties }),
    clearProperties: () => set({ properties: null }),
  }),
)
