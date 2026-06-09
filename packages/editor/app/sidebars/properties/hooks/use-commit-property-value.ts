import { useCallback } from "react"
import { Board, Instance, Theme, Value, Variant } from "@seldon/core"
import type {
  PropertyKey,
  SubPropertyKey,
} from "@seldon/core/properties/types/property-keys"
import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import { parsePropertyPath } from "@lib/properties/property-paths"
import { serializeValue } from "@lib/properties/serialize-value"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useImageUploadPanel } from "@app/panels/hooks/use-upload-image-panel"
import {
  cleanCompoundValue,
  compoundPresetPropertyKey,
} from "../helpers/commit-helpers"
import { createPresetPropertyUpdate } from "../helpers/compound-properties"
import { handleComputedValueChange } from "../helpers/computed-property-handler"
import { isComputedFunctionOption } from "../helpers/computed-utils"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "../helpers/editing-contexts"
import { FlatProperty } from "../helpers/properties-data"
import type { PropertyPickerResult } from "../helpers/options-utils"
import { RESET_VALUES } from "../helpers/property-control-constants"
import { shouldUsePresetPropertyBehavior } from "../helpers/property-types"
import { updateProperty } from "../helpers/property-update-handler"
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
  const { show: showUploadPanel } = useImageUploadPanel()

  const reset = useCallback(() => {
    if (property.isSubProperty) {
      const parsed = parsePropertyPath(property.key)
      if (parsed.kind === "layered-facet") {
        resetProperty(parsed.root as PropertyKey, parsed.facet as SubPropertyKey)
      } else if (parsed.kind === "facet") {
        resetProperty(parsed.root as PropertyKey, parsed.facet as SubPropertyKey)
      } else {
        resetProperty(property.key as PropertyKey)
      }
    } else {
      resetProperty(property.key as PropertyKey)
    }
    onDone()
  }, [property.isSubProperty, property.key, resetProperty, onDone])

  const commit = useCallback(
    (newValue: string) => {
      const subject = propertySubject ?? selection ?? null

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

      const applyPresetPropertyUpdate = (nextValue: string): boolean => {
        if (!shouldUsePresetPropertyBehavior(property.key)) {
          return false
        }
        const update = createPresetPropertyUpdate(
          property.key,
          nextValue,
          workspace,
          selection!,
          theme,
        )
        if (Object.keys(update).length > 0) {
          setProperties(update, { mergeSubProperties: false })
        }
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

      if (newValue === "__upload__") {
        const supportsUpload =
          property.key === "source" ||
          property.key === "background.0.image" ||
          property.key === "background.image"

        if (supportsUpload) {
          // Convert property key to upload panel format:
          // - Sub-properties (with dots): replace dots with hyphens (e.g., "background.image" -> "background-image")
          // - Top-level properties: use as-is (e.g., "source" -> "source")
          const uploadPanelProperty = property.key.includes(".")
            ? property.key.replace(/\./g, "-")
            : property.key

          showUploadPanel({
            property: uploadPanelProperty as "source" | "background-image",
          })
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
        // Check if this is a compound property with a preset sub-property
        if (property.isCompound) {
          const presetPropertyKey = compoundPresetPropertyKey(property.key)
          const update = createPresetPropertyUpdate(
            presetPropertyKey,
            newValue,
            workspace,
            selection!,
            theme,
          )
          if (Object.keys(update).length > 0) {
            setProperties(update, { mergeSubProperties: false })
            onDone()
            return
          }
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

        if (isPresetValue) {
          const presetPropertyKey = compoundPresetPropertyKey(property.key)
          const update = createPresetPropertyUpdate(
            presetPropertyKey,
            newValue,
            workspace,
            selection!,
            theme,
          )
          if (Object.keys(update).length > 0) {
            setProperties(update, { mergeSubProperties: false })
            onDone()
            return
          }
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
