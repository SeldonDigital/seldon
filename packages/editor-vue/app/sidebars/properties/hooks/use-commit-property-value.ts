import { useBoardStateStore } from "@app/canvas/board-state-store"
import { useImageUploadStore } from "@app/dialogs/image-upload/image-upload-store"
import { usePanelStore } from "@app/editor/panel-store"
import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useWorkspace } from "@app/workspace/use-workspace"
import { imageUploadTargetForKey } from "@seldon/editor/lib/dialogs/image-upload-target"
import {
  cleanCompoundValue,
  compoundPresetPropertyKey,
} from "@seldon/editor/lib/properties/commit-helpers"
import { createPresetPropertyUpdate } from "@seldon/editor/lib/properties/inspector/compound-properties"
import { handleComputedValueChange } from "@seldon/editor/lib/properties/inspector/computed-property-handler"
import { isComputedFunctionOption } from "@seldon/editor/lib/properties/inspector/computed-utils"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import {
  type FlatProperty,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { updateProperty } from "@seldon/editor/lib/properties/inspector/property-update-handler"
import { RESET_VALUES } from "@seldon/editor/lib/properties/property-control-constants"
import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import { isPresetProperty } from "@seldon/editor/lib/properties/property-types"
import { serializeValue } from "@seldon/editor/lib/properties/serialize-value"
import {
  getComponentKey,
  resolveComponentKey,
} from "@seldon/editor/lib/workspace/workspace-accessors"

import {
  type Board,
  type Instance,
  type Properties,
  type Theme,
  type Value,
  type Variant,
} from "@seldon/core"
import { getEffectiveProperties as coreGetEffectiveProperties } from "@seldon/core/helpers/properties/properties-bridge"
import { getCompoundSelectorFacet } from "@seldon/core/properties/constants/shared/compound-properties"
import { backgroundLayerForKind } from "@seldon/core/properties/values/appearance/background/background-seeds"
import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"
import { nodeRelationshipService } from "@seldon/core/workspace/services"

/** Shown when an instance edit is attempted while a non-Normal state is active. */
const INSTANCE_STATE_EDIT_MESSAGE =
  "Instances use component states. To make changes, select the original or source component and edit the state there."

interface CommitDeps {
  property: () => FlatProperty
  theme: () => Theme | undefined
  options: () => Array<Array<{ name: string; value: string }>> | undefined
  subject: () => Variant | Instance | Board | null
  themeEditingContext?: () => ThemeEditingContext | null
  fontCollectionEditingContext?: () => FontCollectionEditingContext | null
  iconSetEditingContext?: () => IconSetEditingContext | null
  onDone: () => void
}

/**
 * Write router for a property control. Routes a new value to the correct
 * mutation path: editing-context rows, theme assignment, computed functions,
 * reset, compound and layered presets, and plain property updates. Vue port of
 * the React `useCommitPropertyValue`, dispatching the same workspace actions.
 */
export function useCommitPropertyValue(deps: CommitDeps) {
  const dispatch = useDispatch()
  const { workspace } = useWorkspace()
  const boardState = useBoardStateStore()
  const toast = useToastStore()
  const panel = usePanelStore()
  const imageUploadStore = useImageUploadStore()

  // Resolves the active interaction state for the selection's board. Boards and
  // nodes with no owning board resolve to Normal. Mirrors React
  // `getActiveStateForNode`.
  function getActiveState(
    subject: Variant | Instance | Board | null,
  ): NodeState {
    if (!subject || isBoard(subject)) return NORMAL_STATE
    const board = nodeRelationshipService.findBoardForNode(
      subject,
      workspace.value,
    )
    const boardKey = board ? getComponentKey(board) : undefined
    return boardKey ? boardState.getActiveState(boardKey) : NORMAL_STATE
  }

  // Routes a property write to the board, the active state override bag, or the
  // node itself, matching React `useObjectProperties.setProperties`. Instances
  // cannot author states, so a non-Normal instance edit is blocked with a toast.
  function setProperties(
    nodeId: string,
    properties: Record<string, unknown>,
    options?: { mergeSubProperties?: boolean },
  ): void {
    const subject = deps.subject()
    if (subject && isBoard(subject)) {
      dispatch({
        type: "set_component_properties",
        payload: { boardKey: getComponentKey(subject), properties },
      } as never)
      return
    }
    const activeState = getActiveState(subject)
    if (activeState !== NORMAL_STATE) {
      if (subject && isEntryNodeInstance(subject as never)) {
        toast.addToast(INSTANCE_STATE_EDIT_MESSAGE)
        return
      }
      dispatch({
        type: "set_node_state_properties",
        payload: { nodeId, state: activeState, properties, options },
      } as never)
      return
    }
    dispatch({
      type: "set_node_properties",
      payload: { nodeId, properties, options },
    } as never)
  }

  // Routes a property reset to the board, the active state override bag, or the
  // node itself, matching React `useObjectProperties.resetProperty`.
  function resetProperty(
    propertyKey: string,
    subpropertyKey?: string,
    layerIndex?: number,
  ): void {
    const subject = deps.subject()
    if (!subject) return
    if (isBoard(subject)) {
      dispatch({
        type: "reset_component_property",
        payload: {
          boardKey: getComponentKey(subject),
          propertyKey,
          subpropertyKey,
          layerIndex,
        },
      } as never)
      return
    }
    const activeState = getActiveState(subject)
    if (activeState !== NORMAL_STATE) {
      if (isEntryNodeInstance(subject as never)) {
        toast.addToast(INSTANCE_STATE_EDIT_MESSAGE)
        return
      }
      dispatch({
        type: "reset_node_state_property",
        payload: {
          nodeId: subject.id,
          state: activeState,
          propertyKey,
          subpropertyKey,
          layerIndex,
        },
      } as never)
      return
    }
    dispatch({
      type: "reset_node_property",
      payload: { nodeId: subject.id, propertyKey, subpropertyKey, layerIndex },
    } as never)
  }

  function reset(): void {
    const property = deps.property()
    const themeCtx = deps.themeEditingContext?.()
    if (themeCtx?.isThemeEditing) {
      themeCtx.resetThemeProperty(property)
      deps.onDone()
      return
    }
    const subject = deps.subject()
    if (!subject) {
      deps.onDone()
      return
    }
    const parsed = parsePropertyPath(property.key)
    if (property.isSubProperty && parsed.kind === "layered-facet") {
      resetProperty(parsed.root, parsed.facet, parsed.index)
    } else if (property.isSubProperty && parsed.kind === "facet") {
      resetProperty(parsed.root, parsed.facet)
    } else if (parsed.kind === "layered-parent") {
      resetProperty(parsed.root, undefined, parsed.index)
    } else {
      resetProperty(property.key)
    }
    deps.onDone()
  }

  function commit(newValue: string): void {
    const property = deps.property()
    const theme = deps.theme()
    const ws = workspace.value
    const subject = deps.subject()
    const themeCtx = deps.themeEditingContext?.()
    const fontCtx = deps.fontCollectionEditingContext?.()
    const iconCtx = deps.iconSetEditingContext?.()

    // Layered paint parent row: retype its own layer slot, keeping siblings.
    if (
      property.layerIndex != null &&
      subject &&
      !isBoard(subject) &&
      !themeCtx?.isThemeEditing &&
      !fontCtx?.isFontCollectionEditing &&
      !iconCtx?.isIconSetEditing
    ) {
      const parsed = parsePropertyPath(property.key)
      const baseKey =
        parsed.kind === "layered-parent" ? parsed.root : property.key
      const layerIndex = property.layerIndex

      let layerValue: Record<string, unknown>
      if (getCompoundSelectorFacet(baseKey) === "kind") {
        const seedLayer = backgroundLayerForKind(newValue)
        if (!seedLayer) {
          reset()
          return
        }
        layerValue = seedLayer as Record<string, unknown>
      } else {
        const presetSource = createPresetPropertyUpdate(
          compoundPresetPropertyKey(baseKey),
          newValue,
          ws,
          subject,
          theme,
        )
        layerValue =
          (
            presetSource[baseKey] as Array<Record<string, unknown>> | undefined
          )?.[0] ?? {}
      }

      const current = coreGetEffectiveProperties(
        getPropertiesSubjectId(subject),
        ws,
      )[baseKey as keyof Properties]
      const layers = Array.isArray(current)
        ? [...(current as Array<Record<string, unknown>>)]
        : current
          ? [current as Record<string, unknown>]
          : []
      while (layers.length <= layerIndex) layers.push({})
      layers[layerIndex] = layerValue

      setProperties(
        subject.id,
        { [baseKey]: layers },
        {
          mergeSubProperties: false,
        },
      )
      deps.onDone()
      return
    }

    // Editing contexts route straight to the workspace.
    if (fontCtx?.isFontCollectionEditing) {
      fontCtx.updateFontCollectionProperty(property, newValue)
      deps.onDone()
      return
    }
    if (iconCtx?.isIconSetEditing) {
      iconCtx.updateIconSetProperty(property, newValue)
      deps.onDone()
      return
    }

    if (property.key === "theme" && subject) {
      const newThemeId =
        newValue === "none" ? null : (newValue as ThemeInstanceId)
      if (isBoard(subject)) {
        dispatch({
          type: "set_component_theme",
          payload: {
            boardKey: resolveComponentKey(subject, ws),
            theme: newThemeId || "seldon",
          },
        } as never)
      } else {
        dispatch({
          type: "set_node_theme",
          payload: { nodeId: subject.id, theme: newThemeId },
        } as never)
      }
      deps.onDone()
      return
    }

    if (property.key === "reference" && subject && !isBoard(subject)) {
      dispatch({
        type: "set_node_ref",
        payload: { nodeId: subject.id, ref: newValue },
      } as never)
      deps.onDone()
      return
    }

    if (!subject) {
      deps.onDone()
      return
    }
    const nodeId = getPropertiesSubjectId(subject)

    // Open the image upload dialog for the row's image target.
    if (newValue === "__upload__") {
      const uploadTarget = imageUploadTargetForKey(property.key)
      if (uploadTarget) {
        imageUploadStore.setProperty(uploadTarget)
        panel.openPanel("image-upload")
      }
      deps.onDone()
      return
    }

    // Computed function values.
    if (isComputedFunctionOption(newValue)) {
      const handled = handleComputedValueChange({
        property,
        newValue,
        workspace: ws,
        selection: subject,
        setProperties: (nextProperties, nextOptions) =>
          setProperties(nodeId, nextProperties, nextOptions),
        cleanCompoundValue,
      })
      if (handled) deps.onDone()
      return
    }

    const writePresetUpdate = (presetKey: string, value: string): boolean => {
      const update = createPresetPropertyUpdate(
        presetKey,
        value,
        ws,
        subject,
        theme,
      )
      if (Object.keys(update).length === 0) return false
      setProperties(nodeId, update, { mergeSubProperties: false })
      return true
    }

    const applyPresetPropertyUpdate = (value: string): boolean => {
      if (!isPresetProperty(property.key)) return false
      if (parsePropertyPath(property.key).kind === "layered-facet") return false
      writePresetUpdate(property.key, value)
      deps.onDone()
      return true
    }

    // Reset values (Default, None, empty string).
    if (RESET_VALUES.includes(newValue as (typeof RESET_VALUES)[number])) {
      if (themeCtx?.isThemeEditing) {
        themeCtx.resetThemeProperty(property)
        deps.onDone()
        return
      }
      if (
        property.isCompound &&
        writePresetUpdate(compoundPresetPropertyKey(property.key), newValue)
      ) {
        deps.onDone()
        return
      }
      if (applyPresetPropertyUpdate(newValue)) return
      reset()
      return
    }

    // Theme editing updates.
    if (themeCtx?.isThemeEditing) {
      themeCtx.updateThemeProperty(property, newValue)
      deps.onDone()
      return
    }

    const serializedValue = serializeValue(
      newValue,
      { currentValue: property.value as Value | undefined, workspace: ws },
      subject,
      property.key,
    )

    const options = deps.options()
    if (property.isCompound && options) {
      const flatOptions = options.flat()
      const isPresetValue = flatOptions.some((opt) => opt.value === newValue)
      if (
        isPresetValue &&
        writePresetUpdate(compoundPresetPropertyKey(property.key), newValue)
      ) {
        deps.onDone()
        return
      }
    }

    if (applyPresetPropertyUpdate(newValue)) return

    updateProperty({
      property,
      value: serializedValue,
      setProperties: (nextProperties, nextOptions) =>
        setProperties(nodeId, nextProperties, nextOptions),
    })

    deps.onDone()
  }

  return { commit, reset }
}
