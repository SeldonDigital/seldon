import { ComponentId } from "../../../components/constants"
import { Properties, PropertyKey, SubPropertyKey } from "../../../properties"
import { Theme, ThemeInstanceId, ThemeSwatchKey } from "../../../themes/types"
import { applyResetDefaultVariantToCatalog } from "../../helpers/nodes/apply-reset-default-variant-to-catalog"
import { applyResetUserVariantToDefaultVariant } from "../../helpers/nodes/apply-reset-user-variant-to-default-variant"
import {
  BoardKey,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import {
  getInitialComponentLabel,
  getInitialVariantLabel,
  setNodeEditorData,
  setNodeLabel,
} from "./label-mutations"
import {
  resetComponentProperty,
  resetNodeOverrides,
  resetNodeProperty,
  setComponentProperties,
  setNodeProperties,
} from "./node-property-mutations"
import { replaceSwatchRefsWithExactColor } from "./swatch-ref-replacement"
import {
  getInheritedTheme,
  getNodeTheme,
  setComponentTheme,
  setNodeTheme,
} from "./theme-mutations"

interface PropertyResetTarget {
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}

/**
 * Facade over the workspace mutation operations. Each method delegates to a
 * topical module: label, property, theme, and swatch-ref mutations.
 */
export class WorkspaceMutationService {
  public setNodeLabel(
    nodeId: VariantId | InstanceId,
    label: string,
    workspace: Workspace,
  ): Workspace {
    return setNodeLabel(nodeId, label, workspace)
  }

  public setNodeEditorData(
    nodeId: VariantId | InstanceId,
    editorData: Record<string, unknown> | undefined,
    workspace: Workspace,
  ): Workspace {
    return setNodeEditorData(nodeId, editorData, workspace)
  }

  public getInitialVariantLabel(
    componentId: ComponentId,
    workspace: Workspace,
  ): string {
    return getInitialVariantLabel(componentId, workspace)
  }

  public getInitialComponentLabel(componentId: ComponentId): string {
    return getInitialComponentLabel(componentId)
  }

  public setNodeProperties(
    nodeId: VariantId | InstanceId,
    properties: Properties,
    workspace: Workspace,
    options?: { mergeSubProperties?: boolean },
  ): Workspace {
    return setNodeProperties(nodeId, properties, workspace, options)
  }

  public resetNodeProperty(
    nodeId: VariantId | InstanceId,
    target: PropertyResetTarget,
    workspace: Workspace,
  ): Workspace {
    return resetNodeProperty(nodeId, target, workspace)
  }

  public resetNodeOverrides(
    nodeId: VariantId | InstanceId,
    workspace: Workspace,
  ): Workspace {
    return resetNodeOverrides(nodeId, workspace)
  }

  public setComponentProperties(
    boardKey: BoardKey,
    properties: Properties,
    workspace: Workspace,
  ): Workspace {
    return setComponentProperties(boardKey, properties, workspace)
  }

  public resetComponentProperty(
    boardKey: BoardKey,
    target: PropertyResetTarget,
    workspace: Workspace,
  ): Workspace {
    return resetComponentProperty(boardKey, target, workspace)
  }

  /** Replaces a user variant's composition tree with the board's default variant tree. */
  public resetUserVariantToDefaultVariant(
    variantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetUserVariantToDefaultVariant(workspace, variantRootId)
  }

  /** Rebuilds a default variant's composition tree to match its catalog schema default. */
  public resetDefaultVariantToCatalog(
    defaultVariantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetDefaultVariantToCatalog(workspace, defaultVariantRootId)
  }

  public setComponentTheme(
    boardKey: BoardKey,
    theme: ThemeInstanceId,
    workspace: Workspace,
  ): Workspace {
    return setComponentTheme(boardKey, theme, workspace)
  }

  public setNodeTheme(
    nodeId: VariantId | InstanceId,
    theme: ThemeInstanceId | null,
    workspace: Workspace,
  ): Workspace {
    return setNodeTheme(nodeId, theme, workspace)
  }

  public getNodeTheme(
    node: Variant | Instance,
    workspace: Workspace,
  ): ThemeInstanceId {
    return getNodeTheme(node, workspace)
  }

  public getInheritedTheme(
    node: Variant | Instance,
    workspace: Workspace,
  ): ThemeInstanceId {
    return getInheritedTheme(node, workspace)
  }

  public replaceSwatchRefsWithExactColor(
    theme: Theme,
    key: ThemeSwatchKey,
    workspace: Workspace,
  ): Workspace {
    return replaceSwatchRefsWithExactColor(theme, key, workspace)
  }
}

export const workspaceMutationService = new WorkspaceMutationService()
