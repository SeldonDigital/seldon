import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import { serializeValue } from "@seldon/editor/lib/properties/serialize-value"
import { useCallback } from "react"
import {
  Board,
  Instance,
  Properties,
  Theme,
  Value,
  Variant,
} from "@seldon/core"
import { getEffectiveProperties as coreGetEffectiveProperties } from "@seldon/core/helpers/properties/properties-bridge"
import { getCompoundSelectorFacet } from "@seldon/core/properties/constants/shared/compound-properties"
import { backgroundLayerForKind } from "@seldon/core/properties/values/appearance/background/background-seeds"
import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { useObjectProperties } from "@app/workspace/hooks/use-object-properties"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  imageUploadTargetForKey,
  useImageUploadPanel,
} from "@app/dialogs/image-upload/hooks/use-upload-image-panel"
import {
  cleanCompoundValue,
  compoundPresetPropertyKey,
  dispatchPropertyReset,
} from "../helpers/commit-helpers"
import { createPresetPropertyUpdate } from "../helpers/compound-properties"
import { handleComputedValueChange } from "../helpers/computed-property-handler"
import { isComputedFunctionOption } from "../helpers/computed-utils"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "../helpers/editing-contexts"
import type { PropertyPickerResult } from "../helpers/options-utils"
import { getPropertiesSubjectId } from "../helpers/properties-data"
import { FlatProperty } from "../helpers/properties-data"
import { RESET_VALUES } from "../helpers/property-control-constants"
import { isPresetProperty } from "../helpers/property-types"
import { updateProperty } from "../helpers/property-update-handler"
import {
  REPEAT_ROW_KEY,
  parseRepeatDataRowKey,
} from "../helpers/repeat-display"
import { useSetNodeRepeat } from "./use-set-node-repeat"
import { useSetObjectReference } from "./use-set-object-reference"
import { useSetObjectTheme } from "./use-set-object-theme"

interface UseCommitPropertyValueInput {
  property: FlatProperty
  theme?: Theme
  /** Built picker options, used to detect preset values on compound properties. */
  options: PropertyPickerResult["options"] | undefined
  propertySubject?: Variant | Instance | Board
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
  /** Run after a successful commit or reset to close the editor. */
  onDone: () => void
}

interface UseCommitPropertyValueResult {
  commit: (newValue: string) => void
  reset: () => void
}

/**
 * Write router for a property control. Owns all Model dispatch and routes a new
 * value to the correct mutation path: editing-context rows, theme assignment,
 * image upload, computed functions, reset, compound and generic presets, and
 * plain property updates. Keeps the control a binding shell.
 */
export function useCommitPropertyValue({
  property,
  theme,
  options,
  propertySubject,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
  onDone,
}: UseCommitPropertyValueInput): UseCommitPropertyValueResult {
  const { setProperties, resetProperty } = useObjectProperties()
  const { workspace } = useWorkspace({ usePreview: false })
  const { selection } = useSelection()
  const setObjectTheme = useSetObjectTheme()
  const setObjectReference = useSetObjectReference()
  const { setCount: setNodeRepeatCount, setDataValue: setNodeRepeatDataValue } =
    useSetNodeRepeat()
  const { show: showUploadPanel } = useImageUploadPanel()

  const reset = useCallback(() => {
    dispatchPropertyReset(property.key, property.isSubProperty, resetProperty)
    onDone()
  }, [property.isSubProperty, property.key, resetProperty, onDone])

  const commit = useCallback(
    (newValue: string) => {
      const subject = propertySubject ?? selection ?? null

      // A layered paint parent row (Background/Shadow N) retypes its own layer
      // slot and writes the full stack back, so sibling layers stay intact. The
      // generic compound preset path replaces the whole stack and would drop
      // them. The slot's new value is sourced from core: compounds with a `kind`
      // selector seed that kind's facets, others apply a theme preset.
      if (
        property.layerIndex != null &&
        subject &&
        !themeEditingContext?.isThemeEditing &&
        !fontCollectionEditingContext?.isFontCollectionEditing &&
        !iconSetEditingContext?.isIconSetEditing
      ) {
        const parsed = parsePropertyPath(property.key)
        const baseKey =
          parsed.kind === "layered-parent" ? parsed.root : property.key
        const layerIndex = property.layerIndex

        let layerValue: Record<string, unknown>
        if (getCompoundSelectorFacet(baseKey) === "kind") {
          // Kind-typed layer (e.g. background). Default resets the slot; a kind
          // value seeds that kind's facets from the core seed map.
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
            workspace,
            subject,
            theme,
          )
          layerValue =
            (
              presetSource[baseKey] as
                | Array<Record<string, unknown>>
                | undefined
            )?.[0] ?? {}
        }

        const current = coreGetEffectiveProperties(
          getPropertiesSubjectId(subject),
          workspace,
        )[baseKey as keyof Properties]
        const layers = Array.isArray(current)
          ? [...(current as Array<Record<string, unknown>>)]
          : current
            ? [current as Record<string, unknown>]
            : []
        while (layers.length <= layerIndex) layers.push({})
        layers[layerIndex] = layerValue

        setProperties({ [baseKey]: layers } as Properties, {
          mergeSubProperties: false,
        })
        onDone()
        return
      }

      const localSerializeValue = (
        nextValue: string,
        currentValue: unknown,
      ) => {
        return serializeValue(
          nextValue,
          {
            currentValue: currentValue as Value | undefined,
            workspace,
          },
          selection || undefined,
          property.key,
        )
      }

      // Applies a preset update for the given key. Returns false without
      // writing when core produced no update, so callers can fall through.
      const writePresetUpdate = (
        presetKey: string,
        nextValue: string,
      ): boolean => {
        const update = createPresetPropertyUpdate(
          presetKey,
          nextValue,
          workspace,
          selection!,
          theme,
        )
        if (Object.keys(update).length === 0) return false
        setProperties(update, { mergeSubProperties: false })
        return true
      }

      const applyPresetPropertyUpdate = (nextValue: string): boolean => {
        if (!isPresetProperty(property.key)) {
          return false
        }
        // A layered-paint facet preset (e.g. `background.<n>.preset`) is a plain
        // per-layer facet, not the compound's selector. The compound-preset apply
        // collapses the whole stack to a single layer at index 0 and drops the
        // layer's `kind`, so route it through the layered-facet merge instead.
        if (parsePropertyPath(property.key).kind === "layered-facet") {
          return false
        }
        writePresetUpdate(property.key, nextValue)
        onDone()
        return true
      }

      // Font collection family rows route edits straight to the workspace through
      // the editing context, bypassing the node/theme property paths.
      if (fontCollectionEditingContext?.isFontCollectionEditing) {
        fontCollectionEditingContext.updateFontCollectionProperty(
          property,
          newValue,
        )
        onDone()
        return
      }

      // Icon set rows route edits straight to the workspace through the editing
      // context, bypassing the node/theme property paths.
      if (iconSetEditingContext?.isIconSetEditing) {
        iconSetEditingContext.updateIconSetProperty(property, newValue)
        onDone()
        return
      }

      if (property.key === "theme" && subject) {
        const newThemeId =
          newValue === "none" ? null : (newValue as ThemeInstanceId)
        setObjectTheme(subject, newThemeId)
        onDone()
        return
      }

      if (property.key === "reference" && subject && !isBoard(subject)) {
        setObjectReference(subject, newValue)
        onDone()
        return
      }

      // The editor-only Repeat row and its per-echo data rows write through the
      // repeat command, which preserves other `__editor` keys. The count row is
      // the compound parent; data rows key the descendant id and echo index.
      if (subject && !isBoard(subject)) {
        if (property.key === REPEAT_ROW_KEY) {
          setNodeRepeatCount(subject.id, Number.parseInt(newValue, 10))
          onDone()
          return
        }
        const dataSlot = parseRepeatDataRowKey(property.key)
        if (dataSlot) {
          setNodeRepeatDataValue(
            subject.id,
            dataSlot.descendantId,
            dataSlot.echoIndex,
            newValue,
          )
          onDone()
          return
        }
      }

      if (newValue === "__upload__") {
        const uploadTarget = imageUploadTargetForKey(property.key)
        if (uploadTarget) {
          showUploadPanel({ property: uploadTarget })
          onDone()
          return
        }
      }

      // Handle computed function values
      if (isComputedFunctionOption(newValue)) {
        const handled = handleComputedValueChange({
          property,
          newValue,
          workspace,
          selection: selection || null,
          setProperties,
          cleanCompoundValue,
        })
        if (handled) {
          onDone()
        }
        return
      }

      // Handle reset values (Default, None, empty string)
      if (RESET_VALUES.includes(newValue as (typeof RESET_VALUES)[number])) {
        // Theme rows reset their entry override; node reset paths do not apply.
        if (themeEditingContext?.isThemeEditing) {
          themeEditingContext.resetThemeProperty(property)
          onDone()
          return
        }
        // Check if this is a compound property with a preset sub-property
        if (
          property.isCompound &&
          writePresetUpdate(compoundPresetPropertyKey(property.key), newValue)
        ) {
          onDone()
          return
        }

        if (applyPresetPropertyUpdate(newValue)) {
          return
        }
        reset()
        return
      }

      // Handle theme property updates if in theme editing mode
      if (themeEditingContext?.isThemeEditing) {
        themeEditingContext.updateThemeProperty(property, newValue)
        onDone()
        return
      }

      // Handle regular property updates
      const serializedValue = localSerializeValue(newValue, property.value)

      // Check if this is a compound property and the value looks like a preset
      // (theme token starting with @ or a preset name from options)
      if (property.isCompound && options) {
        // Flatten the options array (options is PropertyOption[][])
        const flatOptions = options.flat()
        const isPresetValue = flatOptions.some((opt) => opt.value === newValue)

        if (
          isPresetValue &&
          writePresetUpdate(compoundPresetPropertyKey(property.key), newValue)
        ) {
          onDone()
          return
        }
      }

      if (applyPresetPropertyUpdate(newValue)) {
        return
      }

      updateProperty({
        property,
        value: serializedValue,
        setProperties,
      })

      onDone()
    },
    [
      property,
      theme,
      options,
      propertySubject,
      selection,
      workspace,
      setProperties,
      setObjectTheme,
      setObjectReference,
      setNodeRepeatCount,
      setNodeRepeatDataValue,
      showUploadPanel,
      themeEditingContext,
      fontCollectionEditingContext,
      iconSetEditingContext,
      onDone,
      reset,
    ],
  )

  return { commit, reset }
}
