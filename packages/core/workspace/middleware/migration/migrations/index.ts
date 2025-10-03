import { produce } from "immer"
import { isSingular, plural } from "pluralize"
import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import { Display } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { computeTheme } from "../../../../themes/helpers/compute-theme"
import { workspaceService } from "../../../services/workspace.service"
import { Workspace } from "../../../types"
import { deletedComponents } from "../deleted-components"
import { isNodeV2 } from "../helpers/is-node-v2"
import { removePropertiesThatArentOverrides } from "../helpers/remove-properties-that-arent-overrides"
import { renameToneToBrightness } from "../helpers/rename-tone-to-brightness"
import { updateComponentId } from "../helpers/update-component-id"
import { updatedComponentIds } from "../updated-component-ids"

// Migration function type
export type MigrationFunction = (workspace: Workspace) => Workspace

// Migration record type
export interface MigrationRecord {
  version: number
  description: string
  migrate: MigrationFunction
}

export interface AlwaysRunMigrationRecord {
  description: string
  migrate: MigrationFunction
}

// Migration registry - make sure you add the latest migration to the start of the array!
export const migrations: MigrationRecord[] = [
  // Example migration - add more as needed. Please keep this example as a reference.
  // {
  //   version: 999,
  //   description: "Add new field to all nodes",
  //   migrate: (workspace: Workspace) => {
  //     // Migration logic here
  //     return workspace
  //   }
  // }

  {
    version: 15,
    description: "Fix ButtonBar component level from ELEMENT to PART",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Update all nodes that are ButtonBar components
        for (const node of Object.values(draft.byId)) {
          // Safety check: ensure node exists and has required properties
          if (
            !node ||
            typeof node.component !== "string" ||
            typeof node.level !== "string"
          ) {
            continue
          }

          // Only update the level for ButtonBar components that are currently ELEMENT level
          if (
            node.component === ComponentId.BAR_BUTTONS &&
            node.level === ComponentLevel.ELEMENT
          ) {
            node.level = ComponentLevel.PART
          }
        }
      })
    },
  },
  {
    version: 13,
    description: "Rename tone properties to brightness properties",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Migrate workspace-level properties
        renameToneToBrightness(draft.customTheme)

        // Migrate board properties
        for (const board of Object.values(draft.boards)) {
          if (board?.properties) {
            renameToneToBrightness(board.properties)
          }
        }

        // Migrate all node properties (variants and instances)
        for (const node of Object.values(draft.byId)) {
          if (node?.properties) {
            renameToneToBrightness(node.properties)
          }
        }
      })
    },
  },
  {
    version: 12,
    description: "Compute custom theme",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Swatches no longer have a parameters property since they
        // are now (re)computed every time we change relevant values of theme.core
        draft.customTheme = computeTheme(draft.customTheme)
      })
    },
  },
  {
    version: 11,
    description: "Update dispay:hidden to display:exclude",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        for (const node of Object.values(draft.byId)) {
          if (node.properties.display?.value === Display.HIDE) {
            node.properties.display.value = Display.EXCLUDE
          }
        }
      })
    },
  },
  {
    version: 10,
    description: "Add font family to custom theme",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        if (!draft.customTheme.fontFamily) {
          draft.customTheme.fontFamily = {
            primary: "Inter",
            secondary: "Inter",
          }
        }
      })
    },
  },
  {
    version: 9,
    description: "Align board order",
    migrate: (workspace: Workspace) => {
      return workspaceService.realignBoardOrder(workspace)
    },
  },
  {
    version: 8,
    description: "Remove properties that arent overrides",
    migrate: removePropertiesThatArentOverrides,
  },

  {
    version: 6,
    description: "Remove editorMeta__ from all nodes and boards",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Update boards
        for (const board of Object.values(draft.boards)) {
          if ("editorMeta__" in board) {
            delete board.editorMeta__
          }
        }

        for (const node of Object.values(draft.byId)) {
          if ("editorMeta__" in node) {
            delete node.editorMeta__
          }
        }
      })
    },
  },
  {
    version: 5,
    description: "Rename boards to plural",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Update boards
        for (const board of Object.values(draft.boards)) {
          if (isSingular(board.label)) {
            board.label = plural(board.label)
          }
        }

        for (const node of Object.values(draft.byId)) {
          if (workspaceService.isDefaultVariant(node)) {
            const schema = getComponentSchema(node.component)
            node.label = schema.name
          }
        }
      })
    },
  },
  {
    version: 4,
    description:
      "Rename google-material-3 to material and remove references to Reversed theme",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Update boards
        for (const board of Object.values(draft.boards)) {
          // @ts-expect-error - we're migrating from a version that doesn't have the theme type
          if (board.theme === "google-material-3") {
            board.theme = "material"
          }

          // @ts-expect-error - we're migrating from a version that doesn't have the theme type
          if (board.theme === "reversed") {
            throw new Error(
              "Reversed theme is not supported. Please remove this workspace.",
            )
          }
        }

        // Update nodes in byId
        for (const node of Object.values(draft.byId)) {
          // @ts-expect-error - we're migrating from a version that doesn't have the theme type
          if (node.theme === "google-material-3") {
            node.theme = "material"
          }

          // @ts-expect-error - we're migrating from a version that doesn't have the theme type
          if (node.theme === "reversed") {
            throw new Error(
              "Reversed theme is not supported. Please remove this workspace.",
            )
          }
        }
      })
    },
  },
  {
    version: 3,
    description: "Add fromSchema property to all instances (20250730)",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        for (const node of Object.values(draft.byId)) {
          if (isNodeV2(node)) {
            node.fromSchema = false
          }
        }
      })
    },
  },
  {
    version: 2,
    description: "Add custom theme to workspace",
    migrate: (workspace: Workspace) => {
      if (workspace.customTheme) {
        return workspace
      }

      // Always set customTheme to the imported value
      return {
        ...workspace,
        customTheme,
      }
    },
  },
  {
    version: 1,
    description: "Example migration",
    migrate: (workspace: Workspace) => {
      return workspace
    },
  },
]

// These migrations are always run on the workspace, regardless of the version
export const schemaMigrations: AlwaysRunMigrationRecord[] = [
  {
    description: "Fix ButtonBar component ID from buttonBar to barButtons",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // First, update all variant and instanceOf references in child nodes
        for (const node of Object.values(draft.byId)) {
          if (node && typeof node === "object") {
            // Update variant references
            if (
              "variant" in node &&
              typeof node.variant === "string" &&
              node.variant.startsWith("variant-buttonBar-")
            ) {
              ;(node as any).variant = node.variant.replace(
                "variant-buttonBar-",
                "variant-barButtons-",
              )
            }

            // Update instanceOf references
            if (
              "instanceOf" in node &&
              typeof node.instanceOf === "string" &&
              node.instanceOf.startsWith("variant-buttonBar-")
            ) {
              ;(node as any).instanceOf = node.instanceOf.replace(
                "variant-buttonBar-",
                "variant-barButtons-",
              )
            }
          }
        }

        // Update all nodes that have the old "buttonBar" component ID or old variant IDs
        const nodesToUpdate: { oldId: string; newId: string; node: any }[] = []

        for (const [nodeId, node] of Object.entries(draft.byId)) {
          // Safety check: ensure node exists and has required properties
          if (!node || typeof node.component !== "string") {
            continue
          }

          // Update the component ID from old "buttonBar" to new "barButtons"
          if ((node.component as string) === "buttonBar") {
            node.component = ComponentId.BAR_BUTTONS
          }

          // If this is a variant node with the old ID pattern, we need to update its ID too
          // This handles cases where the component is already "barButtons" but the variant ID is still old
          if (nodeId.startsWith("variant-buttonBar-")) {
            const newVariantId = nodeId.replace(
              "variant-buttonBar-",
              "variant-barButtons-",
            )
            nodesToUpdate.push({ oldId: nodeId, newId: newVariantId, node })
          }
        }

        // Update variant IDs after processing all nodes
        for (const { oldId, newId, node } of nodesToUpdate) {
          delete draft.byId[oldId]
          draft.byId[newId] = { ...node, id: newId }
        }

        // Also update board IDs that have the old "buttonBar" component ID
        const boards = draft.boards as any
        if (boards["buttonBar"]) {
          const buttonBarBoard = boards["buttonBar"]
          buttonBarBoard.id = "barButtons" // Update the board's internal ID

          // Update variant references in the board
          if (buttonBarBoard.variants) {
            buttonBarBoard.variants = buttonBarBoard.variants.map(
              (variantId: string) =>
                variantId.replace("variant-buttonBar-", "variant-barButtons-"),
            )
          }

          delete boards["buttonBar"]
          boards["barButtons"] = buttonBarBoard
        }

        // Also update variant references in existing barButtons board
        if (boards["barButtons"] && boards["barButtons"].variants) {
          boards["barButtons"].variants = boards["barButtons"].variants.map(
            (variantId: string) =>
              variantId.replace("variant-buttonBar-", "variant-barButtons-"),
          )
        }
      })
    },
  },
  {
    description: "Remove button iconic",
    migrate: (workspace: Workspace) => {
      let updatedWorkspace = workspace
      for (const component of deletedComponents) {
        updatedWorkspace = workspaceService.deleteBoard(
          component as ComponentId,
          updatedWorkspace,
        )
      }

      return updatedWorkspace
    },
  },
  {
    description:
      "Change headerPanels to headerPanel, headerActions to headerAction, headerCards to headerCard",
    migrate: (workspace: Workspace) => {
      let updatedWorkspace = workspace
      for (const [oldId, newId] of Object.entries(updatedComponentIds)) {
        updatedWorkspace = updateComponentId(
          updatedWorkspace,
          oldId as ComponentId,
          newId,
        )
      }

      return updatedWorkspace
    },
  },
]
