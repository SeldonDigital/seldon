import { ValueType, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import type { EntryNode } from "@seldon/core/workspace/types"

export const VARIANT_BUTTON_ID = "variant-button-default"

export function createButtonVariantWorkspace(): Workspace {
  return {
    metadata: {
      version: 0,
      label: "Test",
      owner: "",
      lastUpdate: "",
      intent: "",
      tags: [],
    },
    components: {
      button: {
        type: "component",
        level: "element",
        catalogId: ComponentId.BUTTON,
        label: "Button",
        author: "Test",
        componentTheme: "default",
        componentProperties: {},
        variants: [{ id: VARIANT_BUTTON_ID }],
      },
    },
    nodes: {
      [VARIANT_BUTTON_ID]: {
        type: "default",
        id: VARIANT_BUTTON_ID,
        template: `catalog:${ComponentId.BUTTON}`,
        overrides: {
          background: [
            {
              preset: {
                type: ValueType.THEME_CATEGORICAL,
                value: "@background.primary",
              },
              color: { type: ValueType.EMPTY, value: null },
            },
          ],
        },
        theme: "default",
      } satisfies EntryNode,
    },
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
}
