# Core Properties

The properties system is the foundation of Seldon's design system, providing a type-safe way to define, validate, and process component properties. It supports theme integration, compound properties, and various value types.

## Quick Start

### For Engineers
```typescript
import { Properties, Sdn } from "@seldon/core"

// Simple properties
const buttonProps: Properties = {
  color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
  fontSize: { type: Sdn.ValueType.THEME_ORDINAL, value: "@fontSize.medium" }
}

// Compound properties
const layoutProps: Properties = {
  margin: {
    top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.medium" },
    bottom: { type: Sdn.ValueType.EXACT, value: { unit: "px", value: 16 } }
  }
}
```

### For Designers
- **7 Value Types**: EXACT, PRESET, THEME_CATEGORICAL, THEME_ORDINAL, COMPUTED, EMPTY, INHERIT
- **Theme References**: Use `@swatch.primary`, `@fontSize.large` for consistent styling
- **Compound Properties**: Group related properties like `margin.top`, `border.color`
- **Type Safety**: All properties are validated at compile time

## 🎯 Core Concepts

### Value Types

The properties system uses a hierarchical value type system:

```typescript
enum ValueType {
  PRESET = "preset",                    // Predefined options
  THEME_ORDINAL = "theme.ordinal",      // Sequential theme values
  THEME_CATEGORICAL = "theme.categorical", // Non-sequential theme values
  EXACT = "exact",                      // Custom values (colors, sizes, etc.)
  COMPUTED = "computed",                // Derived values
  EMPTY = "empty",                      // Unset values
  INHERIT = "inherit",                  // Inherited values
}
```

### Property Categories

#### **Primitive Properties**
Simple, single-value properties:
```typescript
type Properties = {
  color: ColorValue | EmptyValue
  fontSize: FontSizeValue | EmptyValue
  opacity: PercentageValue | EmptyValue
  display: DisplayValue | EmptyValue
  // ... many more
}
```

#### **Compound Properties**
Properties with multiple sub-properties:
```typescript
type Properties = {
  background: BackgroundValue    // color, image, position, etc.
  border: BorderValue           // width, style, color, etc.
  margin: MarginValue           // top, right, bottom, left
  padding: PaddingValue         // top, right, bottom, left
  font: FontValue              // family, size, weight, etc.
  shadow: ShadowValue          // blur, spread, color, etc.
  // ... more compound properties
}
```

## 🎨 Value Types

### Color Values

Support for multiple color formats with theme integration:

```typescript
type ColorValue = 
  | ColorThemeValue      // @swatch.primary
  | HSLValue            // { type: "exact", value: { hue: 0, saturation: 100, lightness: 50 } }
  | RGBValue            // { type: "exact", value: { red: 255, green: 0, blue: 0 } }
  | HexValue            // { type: "exact", value: "#ff0000" }
  | LCHValue            // { type: "exact", value: { lightness: 50, chroma: 100, hue: 0 } }
  | TransparentValue    // { type: "exact", value: "transparent" }
```

### Theme Values

Theme values reference design system tokens:

```typescript
// Categorical theme values (non-sequential)
type ColorThemeValue = {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeSwatchKey  // "@swatch.primary", "@swatch.secondary"
}

// Ordinal theme values (sequential)
type FontSizeThemeValue = {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey  // "@fontSize.small", "@fontSize.medium", "@fontSize.large"
}
```

### Dimension Values

Sizing with multiple units:

```typescript
type DimensionValue = 
  | PixelValue      // { type: "exact", value: { unit: "px", value: 16 } }
  | RemValue        // { type: "exact", value: { unit: "rem", value: 1 } }
  | PercentageValue // { type: "exact", value: { unit: "%", value: 100 } }
  | DimensionThemeValue // { type: "theme.ordinal", value: "@size.small" }
```

## 🏗️ Compound Properties

### Background Properties

```typescript
interface BackgroundValue {
  preset?: BackgroundPresetValue    // Theme background preset
  color?: BackgroundColorValue      // Background color
  brightness?: BackgroundBrightnessValue // Brightness adjustment
  opacity?: BackgroundOpacityValue  // Opacity level
  image?: BackgroundImageValue      // Background image
  position?: BackgroundPositionValue // Image position
  size?: BackgroundSizeValue        // Image size
  repeat?: BackgroundRepeatValue    // Image repeat
}
```

### Border Properties

```typescript
interface BorderValue {
  preset?: BorderPresetValue        // Theme border preset
  width?: BorderWidthValue          // Border width
  style?: BorderStyleValue          // Border style (solid, dashed, etc.)
  color?: BorderColorValue          // Border color
  opacity?: BorderOpacityValue      // Border opacity
}
```

### Margin/Padding Properties

```typescript
interface MarginValue {
  top?: MarginSideValue
  right?: MarginSideValue
  bottom?: MarginSideValue
  left?: MarginSideValue
}

// Each side can be:
type MarginSideValue = 
  | MarginSideThemeValue  // @margin.small
  | PixelValue           // 16px
  | RemValue             // 1rem
  | EmptyValue           // Not set
```

## 🔧 Property Processing

### Merging Properties

The `mergeProperties` helper combines property objects:

```typescript
import { mergeProperties } from '@seldon/core/properties'

const baseProperties = {
  color: { type: 'exact', value: '#000000' },
  fontSize: { type: 'theme.ordinal', value: '@fontSize.medium' }
}

const overrides = {
  color: { type: 'exact', value: '#ff0000' },
  background: { 
    color: { type: 'exact', value: '#ffffff' }
  }
}

const merged = mergeProperties(baseProperties, overrides)
// Result: color overridden, fontSize preserved, background added
```

### Property Validation

Properties include validation through TypeScript types:

```typescript
// ✅ Valid properties
const validProps: Properties = {
  color: { type: 'theme.categorical', value: '@swatch.primary' },
  fontSize: { type: 'exact', value: { unit: 'rem', value: 1.5 } },
  margin: {
    top: { type: 'theme.ordinal', value: '@margin.small' },
    bottom: { type: 'exact', value: { unit: 'px', value: 16 } }
  }
}

// ❌ TypeScript will catch invalid properties
const invalidProps: Properties = {
  color: { type: 'invalid', value: 'red' }, // Type error
  fontSize: { type: 'exact', value: 'large' } // Type error - should be object
}
```

## 🎨 Theme Integration

### Theme Value Resolution

Properties automatically resolve theme values:

```typescript
// Theme value
const themeColor = { type: 'theme.categorical', value: '@swatch.primary' }

// Resolved to actual color value
const resolved = resolveColor(themeColor, theme) // "#007bff"
```

### Theme Migration

Properties support theme migration:

```typescript
import { migrateNodePropertiesToTheme } from '@seldon/core/helpers'

// Migrate properties from one theme to another
const updatedWorkspace = migrateNodePropertiesToTheme(
  nodeId,
  'old-theme',
  'new-theme',
  workspace
)
```

## 📝 Usage Examples

### Creating Properties

```typescript
import { Properties, ValueType } from '@seldon/core/properties'

// Simple color property
const colorProp: Properties = {
  color: { type: ValueType.THEME_CATEGORICAL, value: '@swatch.primary' }
}

// Compound background property
const backgroundProp: Properties = {
  background: {
    color: { type: ValueType.EXACT, value: '#ffffff' },
    opacity: { type: ValueType.EXACT, value: { unit: '%', value: 90 } }
  }
}

// Layout properties
const layoutProps: Properties = {
  margin: {
    top: { type: ValueType.THEME_ORDINAL, value: '@margin.medium' },
    bottom: { type: ValueType.EXACT, value: { unit: 'px', value: 24 } }
  },
  padding: {
    left: { type: ValueType.EXACT, value: { unit: 'rem', value: 1 } },
    right: { type: ValueType.EXACT, value: { unit: 'rem', value: 1 } }
  }
}
```

### Processing Properties

```typescript
import { 
  mergeProperties, 
  processNestedOverridesProps,
  resolveValue 
} from '@seldon/core/properties'

// Merge multiple property sets
const merged = mergeProperties(defaultProps, userProps, themeProps)

// Process parent-to-child property inheritance
const processed = processNestedOverridesProps(
  childProperties,
  parentNestedOverrides,
  'Button'
)

// Resolve theme values
const resolved = resolveValue(themeProperty)
```

## 🛡️ Type Safety

### Property Keys

All property keys are strongly typed:

```typescript
type PropertyKey = keyof Properties
// "color" | "fontSize" | "background" | "margin" | ...

type CompoundPropertyKey = 
  | "background" | "border" | "margin" | "padding" 
  | "font" | "shadow" | "gradient" | "corners" | "position"

type SubPropertyKey = 
  | keyof BackgroundValue    // "color" | "image" | "position" | ...
  | keyof BorderValue        // "width" | "style" | "color" | ...
  | keyof MarginValue        // "top" | "right" | "bottom" | "left"
  // ... more sub-properties
```

### Property Paths

Property paths support dot notation for compound properties:

```typescript
type PropertyPath = 
  | PropertyKey                    // "color", "fontSize"
  | `background.${keyof BackgroundValue}`  // "background.color", "background.image"
  | `border.${keyof BorderValue}`          // "border.width", "border.style"
  | `margin.${keyof MarginValue}`          // "margin.top", "margin.bottom"
```

## 🔄 Value Processing

### Empty Values

Empty values represent unset properties:

```typescript
const EMPTY_VALUE = {
  type: ValueType.EMPTY,
  value: null
} as const

// Check if value is empty
if (value.type === ValueType.EMPTY) {
  // Property is not set
}
```

### Computed Values

Computed values derive from other properties:

```typescript
type ComputedValue = {
  type: ValueType.COMPUTED
  value: {
    basedOn: PropertyKey
    // ... computation parameters
  }
}
```

## 📦 Importing Properties

```typescript
// Import specific types
import { Properties, ValueType, ColorValue } from '@seldon/core/properties'

// Import from specific modules
import { Properties } from '@seldon/core/properties/types'
import { ColorValue } from '@seldon/core/properties/values/color'

// Import constants
import { EMPTY_VALUE, ValueType } from '@seldon/core/properties/constants'

// Import helpers
import { mergeProperties } from '@seldon/core/properties/helpers'
```

## 🎯 Best Practices

1. **Use theme values** for design system consistency
2. **Prefer compound properties** for complex styling
3. **Validate properties** before processing
4. **Use type guards** for runtime type checking
5. **Leverage property merging** for inheritance
6. **Handle empty values** appropriately

## 🔄 Migration and Updates

When updating properties:

1. **Use migration helpers** for theme changes
2. **Validate property structure** after updates
3. **Handle backward compatibility** for existing properties
4. **Update type definitions** when adding new properties

## 🐛 Error Handling

Properties include error handling:

- **TypeScript compilation errors** for invalid property structures
- **Runtime validation** for theme value resolution
- **Graceful fallbacks** for missing theme values
- **Clear error messages** for invalid property values

The properties system provides a type-safe foundation for managing component styling and behavior in the Seldon design system.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Core Properties System. When making changes to the properties functionality:

1. **Update this README first** to reflect the intended property behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the property processing pipeline** follows the documented workflow from value types through theme integration
4. **Ensure property validation** maintains the documented type safety and constraint checking
5. **Validate that theme integration** follows the documented property inheritance patterns

The properties system is designed to be:
- **Type-Safe**: Full TypeScript support with documented property types and value constraints
- **Theme-Aware**: Consistent integration with the design system themes and design tokens
- **Extensible**: Easy to add new properties following documented patterns
- **Predictable**: Property behavior should match documentation exactly
- **Validated**: Multiple layers of validation and verification
- **Consistent**: All property types follow the documented value type system

### Property Development Workflow

When creating or modifying properties:

1. **Define Value Types**: Document the property's value type and constraints
2. **Validate Type Safety**: Ensure properties match documented ValueType specifications
3. **Implement Processing**: Use documented property processing and merging patterns
4. **Test Integration**: Verify theme integration and property inheritance
5. **Update Documentation**: Keep this README current with property changes

### Property Validation

All properties must validate against their documented specifications:
- **Value Types**: Must match documented ValueType specifications (EXACT, PRESET, THEME_CATEGORICAL, THEME_ORDINAL, COMPUTED, EMPTY, INHERIT)
- **Constraints**: Must respect documented allowed values and restrictions
- **Theme Integration**: Must use documented theme reference patterns (@swatch.*, @fontSize.*, etc.)
- **Compound Properties**: Must follow documented nested property structures

This ensures consistency across the entire properties system and maintains the reliability of the design system architecture.

For detailed implementation information, see the specific subsystem documentation:
- [Core README](../README.md) - Core engine and property computation
- [Themes README](../themes/README.md) - Theme integration and design tokens
- [Compute README](../compute/README.md) - Property computation and inheritance
- [Workspace README](../workspace/README.md) - Workspace state management and property processing
