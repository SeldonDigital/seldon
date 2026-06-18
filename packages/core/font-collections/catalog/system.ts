import { computeFontCollection } from "../helpers/compute-font-collection"
import type { StockFontCollection } from "../types/font-collection"

/**
 * The `System` collection. Families render from fonts already on the device and never
 * make a network request. This is the default collection seeded into every workspace.
 */
export const collection: StockFontCollection = {
  metadata: {
    id: "system",
    name: "System",
    description:
      "System and local fonts that render without a network request.",
    intent:
      "Default font collection. Uses fonts already available on the device.",
  },
  families: {
    system: {
      name: "System",
      origin: "local",
      stack: "system-ui",
    },
    appleSystem: {
      name: "Apple System",
      origin: "local",
      stack: "-apple-system",
    },
    cantarell: {
      name: "Cantarell",
      origin: "local",
      stack: "Cantarell",
    },
    helveticaNeue: {
      name: "Helvetica Neue",
      origin: "local",
      stack: '"Helvetica Neue"',
    },
    openSans: {
      name: "Open Sans",
      origin: "local",
      stack: '"Open Sans"',
    },
    roboto: {
      name: "Roboto",
      origin: "local",
      stack: "Roboto",
    },
    segoe: {
      name: "Segoe",
      origin: "local",
      stack: '"Segoe UI"',
    },
    sansSerif: {
      name: "Sans Serif",
      origin: "local",
      stack: "sans-serif",
    },
    ubuntu: {
      name: "Ubuntu",
      origin: "local",
      stack: "Ubuntu",
    },
  },
}

export const defaultFontCollection = computeFontCollection(collection)
