import { computeFontCollection } from "../helpers/compute-font-collection"
import type { StockFontCollection } from "../types/font-collection"

/**
 * The `System` collection. Families render from fonts already on the device and never
 * make a network request. This is the default collection seeded into every workspace.
 */
const collection: StockFontCollection = {
  metadata: {
    id: "system",
    name: "System",
    description: "System and local fonts that render without a network request.",
    intent: "Default font collection. Uses fonts already available on the device.",
  },
  families: {
    sans: {
      name: "System Sans",
      origin: "local",
      stack: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    serif: {
      name: "System Serif",
      origin: "local",
      stack: "Georgia, Cambria, 'Times New Roman', Times, serif",
    },
    mono: {
      name: "System Mono",
      origin: "local",
      stack: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
    },
  },
}

export const defaultFontCollection = computeFontCollection(collection)

export default collection
