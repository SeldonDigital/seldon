import { Theme, ThemeSection, ValueType } from "@seldon/core"

export interface DefaultOptionT {
  name: string
  value: string
}

interface BaseParams {
  allowedValues?: string[]
  includeComputedValue?: boolean
  includeInherit?: boolean
  includeAuto?: boolean
  includeNone?: boolean
}

// If themeOptions and themeSection are provided, standardOptions is optional
interface ThemeParams<OptionT> extends BaseParams {
  themeOptions: Theme[ThemeSection]
  themeSection: `@${ThemeSection}`
  standardOptions?: OptionT[]
}

// If themeOptions and themeSection are not provided, standardOptions is required
interface NonThemeParams<OptionT> extends BaseParams {
  standardOptions: OptionT[]
}

export function getDropdownOptions<
  OptionT extends { name: string; value: string },
>(
  params: ThemeParams<OptionT> | NonThemeParams<OptionT>,
): (OptionT | DefaultOptionT)[][] {
  let options = []

  // 1. None (if enabled)
  const noneOptions: DefaultOptionT[] = []
  if (params.includeNone !== false) {
    // Default to true if not specified
    noneOptions.push({
      name: "None",
      value: ValueType.EMPTY,
    })
  }

  // 2. Computed (if enabled)
  const computedOptions: DefaultOptionT[] = []
  if (params.includeComputedValue) {
    computedOptions.push({
      name: "Computed",
      value: ValueType.COMPUTED,
    })
  }

  // 3. Inherit (if supported)
  const inheritOptions: DefaultOptionT[] = []
  if (params.includeInherit) {
    inheritOptions.push({
      name: "Inherit",
      value: ValueType.INHERIT,
    })
  }

  // 4. Auto (if supported)
  const autoOptions: DefaultOptionT[] = []
  if (params.includeAuto) {
    autoOptions.push({
      name: "Auto",
      value: "auto",
    })
  }

  // 5. Preset Options (from standardOptions)
  const standardOptions: OptionT[] = params.standardOptions || []

  // 6. Theme Options (default theme entries)
  const defaultThemeEntries: DefaultOptionT[] = []
  const customThemeEntries: DefaultOptionT[] = []

  if (
    "themeOptions" in params &&
    "themeSection" in params &&
    params.themeOptions
  ) {
    Object.entries(params.themeOptions).forEach(([id, option]) => {
      // Handle different theme option structures
      let name: string
      if (typeof option === "string") {
        name = option
      } else if (option && typeof option === "object" && "name" in option) {
        name = option.name
      } else {
        // Fallback to the id if no name is available
        name = id
      }

      const entry = {
        name,
        value: `${params.themeSection}.${id}`,
      }

      if (id.startsWith("custom")) {
        customThemeEntries.push(entry)
      } else {
        defaultThemeEntries.push(entry)
      }
    })
  }

  // Build options array in the correct order
  if (noneOptions.length) {
    options.push(noneOptions)
  }

  if (computedOptions.length) {
    options.push(computedOptions)
  }

  if (inheritOptions.length) {
    options.push(inheritOptions)
  }

  if (autoOptions.length) {
    options.push(autoOptions)
  }

  if (standardOptions.length) {
    options.push(standardOptions)
  }

  if (defaultThemeEntries.length) {
    options.push(defaultThemeEntries)
  }

  if (customThemeEntries.length) {
    options.push(customThemeEntries)
  }

  // Apply allowed values filter if specified
  if (params.allowedValues && params.allowedValues.length) {
    options = options.map((list) =>
      list.filter(({ value }) => {
        // Allow None and Computed (if enabled)
        if (
          (params.includeNone !== false && value === ValueType.EMPTY) ||
          (params.includeComputedValue && value === ValueType.COMPUTED)
        ) {
          return true
        }

        // Allow Inherit and Auto only if they're supported
        if (
          (params.includeInherit && value === ValueType.INHERIT) ||
          (params.includeAuto && value === "auto")
        ) {
          return true
        }

        // Allowed values should always be in the list of options
        if (params.allowedValues?.includes(value)) return true

        // Custom presets should always be in the list of options
        if (
          "themeSection" in params &&
          value.startsWith(`${params.themeSection}.custom`)
        ) {
          return true
        }

        return false
      }),
    )
  }

  return options
}
