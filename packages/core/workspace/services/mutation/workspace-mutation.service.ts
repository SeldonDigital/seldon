import { ComponentId } from "../../../components/constants"
import { Properties, PropertyKey, SubPropertyKey } from "../../../properties"
import { Theme, ThemeInstanceId, ThemeSwatchKey } from "../../../themes/types"
import { applyResetDefaultVariantToCatalog } from "../../helpers/nodes/apply-reset-default-variant-to-catalog"
import { applyResetInstanceToOriginal } from "../../helpers/nodes/apply-reset-instance-to-original"
import { applyResetInstanceToSource } from "../../helpers/nodes/apply-reset-instance-to-source"
import { applyResetSchemaVariantToCatalog } from "../../helpers/nodes/apply-reset-schema-variant-to-catalog"
import { applyResetVariantInstances } from "../../helpers/nodes/apply-reset-variant-instances"
import type { RepeatEditorData } from "../../helpers/nodes/node-repeat"
import {
  BoardKey,
  Instance,
  InstanceId,
  NodeState,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import {
  getInitialComponentLabel,
  getInitialVariantLabel,
  setNodeEditorData,
  setNodeLabel,
  setNodeRef,
  setNodeRepeat,
} from "./label-mutations"
import {
  applyComponentPropertiesToAllBoards,
  resetComponentBoard,
  resetComponentProperty,
  resetNodeOverrides,
  resetNodeProperty,
  resetNodeState,
  resetNodeStateProperty,
  setComponentProperties,
  setNodeProperties,
  setNodeStateProperties,
} from "./node-property-mutations"
import { replaceSwatchRefsWithExactColor } from "./swatch-ref-replacement"
import {
  getNodeTheme,
  setComponentTheme,
  setNodeTheme,
} from "./theme-mutations"

interface PropertyResetTarget {
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
  /** Paint-layer slot for layered properties; defaults to layer 0. */
  layerIndex?: number
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

  public setNodeRef(
    nodeId: VariantId | InstanceId,
    ref: string,
    workspace: Workspace,
  ): Workspace {
    return setNodeRef(nodeId, ref, workspace)
  }

  public setNodeEditorData(
    nodeId: VariantId | InstanceId,
    editorData: Record<string, unknown> | undefined,
    workspace: Workspace,
  ): Workspace {
    return setNodeEditorData(nodeId, editorData, workspace)
  }

  public setNodeRepeat(
    nodeId: VariantId | InstanceId,
    repeat: RepeatEditorData | undefined,
    workspace: Workspace,
  ): Workspace {
    return setNodeRepeat(nodeId, repeat, workspace)
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

  public setNodeStateProperties(
    nodeId: VariantId | InstanceId,
    state: NodeState,
    properties: Properties,
    workspace: Workspace,
    options?: { mergeSubProperties?: boolean },
  ): Workspace {
    return setNodeStateProperties(nodeId, state, properties, workspace, options)
  }

  public resetNodeStateProperty(
    nodeId: VariantId | InstanceId,
    state: NodeState,
    target: PropertyResetTarget,
    workspace: Workspace,
  ): Workspace {
    return resetNodeStateProperty(nodeId, state, target, workspace)
  }

  public resetNodeState(
    nodeId: VariantId | InstanceId,
    state: NodeState,
    workspace: Workspace,
  ): Workspace {
    return resetNodeState(nodeId, state, workspace)
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

  public applyComponentPropertiesToAllBoards(
    sourceBoardKey: BoardKey,
    workspace: Workspace,
  ): Workspace {
    return applyComponentPropertiesToAllBoards(sourceBoardKey, workspace)
  }

  public resetComponentBoard(
    boardKey: BoardKey,
    workspace: Workspace,
  ): Workspace {
    return resetComponentBoard(boardKey, workspace)
  }

  /** Rebuilds a single schema-backed user variant to its catalog schema variant. */
  public resetSchemaVariantToCatalog(
    variantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetSchemaVariantToCatalog(workspace, variantRootId)
  }

  /** Rebuilds a default variant's composition tree to match its catalog schema default. */
  public resetDefaultVariantToCatalog(
    defaultVariantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetDefaultVariantToCatalog(workspace, defaultVariantRootId)
  }

  /**
   * Reverts an instance subtree to its source, the node one hop up its template
   * chain. Clears subtree overrides and repoints each node's template to the
   * source's structurally-matching child, so node ids survive and downstream
   * instances keep their overrides.
   */
  public resetInstanceToSource(
    instanceId: InstanceId,
    workspace: Workspace,
  ): Workspace {
    return applyResetInstanceToSource(workspace, instanceId)
  }

  /**
   * Resets every direct instance of a variant back to that variant. Each
   * instance whose template links straight to the variant is reset to source,
   * clearing its subtree overrides and repointing to the variant's children.
   */
  public resetVariantInstances(
    variantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetVariantInstances(workspace, variantRootId)
  }

  /**
   * Reverts an instance subtree to its most original template, in place. Clears
   * subtree overrides and repoints each node's template to its resolved original,
   * so node ids survive and downstream instances keep their overrides.
   */
  public resetInstanceToOriginal(
    instanceId: InstanceId,
    workspace: Workspace,
  ): Workspace {
    return applyResetInstanceToOriginal(workspace, instanceId)
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

  public replaceSwatchRefsWithExactColor(
    theme: Theme,
    key: ThemeSwatchKey,
    workspace: Workspace,
  ): Workspace {
    return replaceSwatchRefsWithExactColor(theme, key, workspace)
  }
}

export const workspaceMutationService = new WorkspaceMutationService()
