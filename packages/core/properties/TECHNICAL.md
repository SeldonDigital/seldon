# Properties System - Technical Reference

This document provides technical implementation details, code examples, and specifications for the Properties System.

## Value Types

Properties use seven value types to handle different data sources and behaviors:

```typescript
enum ValueType {
  EMPTY = "empty",                      // Unset values so they are resolved by platform 
  INHERIT = "inherit",                  // Inherited values
  EXACT = "exact",                      // Custom values (colors, sizes, etc.)
  PRESET = "preset",                    // Predefined options
  COMPUTED = "computed",                // Derived values 
  THEME_CATEGORICAL = "theme.categorical", // Non-sequential theme tokens
  THEME_ORDINAL = "theme.ordinal",      // Sequential theme tokens
}
```

### Value Type Examples

```typescript
// EMPTY - Unset values
{ type: ValueType.EMPTY, value: null }

// INHERIT - Inherited values
{ type: ValueType.INHERIT, value: null }

// EXACT - Custom values
{ type: ValueType.EXACT, value: "#ff0000" }
{ type: ValueType.EXACT, value: { unit: "px", value: 16 } }

// PRESET - Predefined options
{ type: ValueType.PRESET, value: "center" }
{ type: ValueType.PRESET, value: "bold" }

// COMPUTED - Derived values
{ type: ValueType.COMPUTED, 
  value: { 
	function: "auto_fit", 
	input: { basedOn: "#parent.size", factor: 0.8 } 
  }
}

// THEME_CATEGORICAL - Non-sequential theme values
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
{ type: ValueType.THEME_CATEGORICAL, value: "@fontFamily.primary" }

// THEME_ORDINAL - Sequential theme values
{ type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" }
{ type: ValueType.THEME_ORDINAL, value: "@margin.large" }
```

## Property Structure

### Atomic Properties

Single-value properties that represent individual styling attributes:

```typescript
type Properties = {
  color: ColorValue | EmptyValue
  fontSize: FontSizeValue | EmptyValue
  opacity: PercentageValue | EmptyValue
  display: DisplayValue | EmptyValue
}
```

### Compound Properties

Complex properties with multiple sub-properties that group related styling:

```typescript
type Properties = {
  background: BackgroundValue    // color, image, position, size, repeat
  border: BorderValue           // width, style, color, opacity
  font: FontValue              // family, size, weight, style, lineHeight
  shadow: ShadowValue          // offset, blur, spread, color, opacity
}
```

### Shorthand Properties

Properties that provide convenient ways to set multiple related values at once:

```typescript
type Properties = {
  margin: MarginValue           // top, right, bottom, left
  padding: PaddingValue         // top, right, bottom, left
  corners: CornersValue         // topLeft, topRight, bottomLeft, bottomRight
}
```

### Property Access Patterns

**Compound Property Access** - Use dot notation to access compound sub-properties:

```typescript
// Accessing compound properties
properties.border.color
properties.font.size
properties.background.image
properties.shadow.offset
```

**Shorthand Property Access** - Shorthand properties can set multiple values at once:

```typescript
// Setting multiple margin values through shorthand
properties.margin = { top: 10, right: 20, bottom: 10, left: 20 }

// Setting multiple padding values through shorthand
properties.padding = { top: 8, right: 16, bottom: 8, left: 16 }

// Setting multiple corner values through shorthand
properties.corners = { topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4 }
```

## Theme Integration

### Theme Value Types

**Categorical Values** - Non-sequential theme references:
```typescript
// Colors, font families, etc.
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
{ type: ValueType.THEME_CATEGORICAL, value: "@fontFamily.primary" }
```

**Ordinal Values** - Sequential theme references:
```typescript
// Sizes, spacing, etc. (small → medium → large)
{ type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" }
{ type: ValueType.THEME_ORDINAL, value: "@margin.large" }
```

### Reserved Seldon Token Names

**Categorical:** `@swatch.*`, `@fontFamily.*`, `@border.*`, `@gradient.*`, `@shadow.*`

**Ordinal:** `@fontSize.*`, `@margin.*`, `@padding.*`, `@gap.*`, `@size.*`, `@corners.*`

**Reserved Theme Keys:**
- **Sizes:** `tiny`, `xxsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge`, `xxlarge`, `huge`
- **Spacing:** `tight`, `compact`, `cozy`, `comfortable`, `open`
- **Colors:** `primary`, `secondary`, `background`, `white`, `gray`, `black`
- **Font Families:** `primary`, `secondary`
- **Font Presets:** `display`, `heading`, `subheading`, `title`, `subtitle`, `callout`, `body`, `label`, `tagline`, `code`

### Theme Resolution

Theme values resolve to actual values during the export process:

```typescript
// Theme reference
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }

// Resolves to actual color
{ type: ValueType.EXACT, value: "#3b82f6" }
```

## Property Processing

### Property Merging

```typescript
import { mergeProperties } from '@seldon/core/properties'

// Merge properties with inheritance
const merged = mergeProperties(
  schemaProperties,    // Component defaults
  variantProperties,   // Base styling
  instanceProperties,  // User customizations
  themeProperties      // Theme-specific values
)
```

### Validation Examples

```typescript
// ✅ Valid properties
const validProps: Properties = {
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
  fontSize: { type: ValueType.EXACT, value: { unit: "rem", value: 1.5 } }
}

// ❌ TypeScript will catch invalid properties
const invalidProps: Properties = {
  color: { type: "invalid", value: "red" }, // Type error
  fontSize: { type: ValueType.EXACT, value: "large" } // Type error
}
```

## Adding Properties to Core

### Step-by-Step Process

**1. Add to Properties Type**
Update `/packages/core/properties/types/properties.ts`:

```typescript
export type Properties = Partial<{
  // ... existing properties
  newProperty: Restricted<NewPropertyValue | EmptyValue, string>
}>
```

**2. Create Value Type**
Add to `/packages/core/properties/values/` (appropriate category):

```typescript
// /packages/core/properties/values/appearance/new-property.ts
import { ValueType } from "../../constants/shared/value-types"

export interface NewPropertyValue {
  type: ValueType.EXACT
  value: string
  restrictions?: {
    allowedValues?: string[]
    maxLength?: number
  }
}
```

**3. Add Constants**
Create enums in `/packages/core/properties/constants/` (appropriate category):

```typescript
// /packages/core/properties/constants/appearance/new-property.ts
export enum NewPropertyOption {
  OPTION1 = "option1",
  OPTION2 = "option2",
  OPTION3 = "option3"
}
```

**4. Update Exports**
Add to `/packages/core/properties/index.ts`:

```typescript
export { NewPropertyValue } from "./values/appearance/new-property"
export { NewPropertyOption } from "./constants/appearance/new-property"
```

**Note**: Constants are organized by category. Choose the appropriate subdirectory:
- `./constants/appearance/` - for visual appearance constants (colors, borders, backgrounds)
- `./constants/typography/` - for text-related constants (alignments, cases, decorations)
- `./constants/layout/` - for layout constants (alignments, directions, displays)
- `./constants/effects/` - for visual effects (scroll, shadows)
- `./constants/attributes/` - for HTML attributes (cursors, elements, input types)
- `./constants/shared/` - for common constants (value types, units, computed functions)
- `./constants/utilities/` - for utility constants (image fits, etc.)

**5. Add Tests**
Create test files following existing patterns:

```typescript
// /packages/core/properties/values/appearance/new-property.test.ts
import { describe, expect, it } from "bun:test"
import { NewPropertyValue } from "./new-property"
import { ValueType } from "../../constants/shared/value-types"

describe("NewPropertyValue", () => {
  it("should create valid property value", () => {
    const value: NewPropertyValue = {
      type: ValueType.EXACT,
      value: "test-value"
    }
    
    expect(value.type).toBe(ValueType.EXACT)
    expect(value.value).toBe("test-value")
  })
})
```

## Type Safety

### Value Type Constraints
```typescript
// Restricted types with validation
type Restricted<T, R> = T & { restrictions?: R }

// Example: Column count with range validation
columns: Restricted<ColumnCountValue | EmptyValue, number>
// Restrictions: min: 1, max: 100
```

### Property Path Validation
```typescript
// Dot notation for compound properties
type PropertyPath = 
  | PropertyKey                    // "color", "fontSize"
  | `background.${keyof BackgroundValue}`  // "background.color", "background.image"
  | `border.${keyof BorderValue}`          // "border.width", "border.style"
```

### Theme Reference Validation
```typescript
// Theme references are validated at compile time
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" } // ✅ Valid
{ type: ValueType.THEME_CATEGORICAL, value: "@invalid.token" }  // ❌ Type error
```

## Code Export Integration

### CSS Export Process
1. **Property Resolution** → Resolve all theme and computed values
2. **CSS Generation** → Convert properties to CSS classes
3. **Theme Variables** → Generate CSS custom properties as tokens for special case use in a project
4. **Class Deduplication** → Optimize CSS output

```typescript
import { exportCss } from '@seldon/factory/export/css'

// Export CSS from workspace
const stylesheet = await exportCss(workspace)
```

### React Export Process
1. **Component Discovery** → Identify components to export
2. **Property Resolution** → Resolve all property values
3. **Interface Generation** → Create TypeScript interfaces
4. **Component Generation** → Generate React components

```typescript
import { exportReact } from '@seldon/factory/export/react'

// Export React components from workspace
const components = await exportReact(workspace, options)
```

### Future Code Exports

The properties system is designed to support additional export targets:

1. **Swift** - Native iOS components with UIKit/SwiftUI
2. **Java** - Android components with native Android views
3. **Flutter** - Cross-platform mobile components with Dart

These exports will follow the same property resolution pipeline, ensuring consistent design system implementation across all platforms.

## Testing Requirements

### Unit Tests
- Test value type creation and validation
- Test property structure and constraints
- Test theme reference validation

### Integration Tests
- Test property resolution and inheritance
- Test property merging and precedence
- Test computed property calculation

### Theme Tests
- Test theme value resolution
- Test theme reference validation
- Test theme switching behavior

### Export Tests
- Test code generation accuracy
- Test property-to-CSS conversion
- Test property-to-React conversion

## Performance Considerations

### Optimization Strategies
1. **Minimize computed properties** - use only when necessary
2. **Cache resolved values** when possible
3. **Optimize property merging** for large workspaces
4. **Use efficient validation** for runtime checks

### Memory Management
1. **Reuse property objects** where possible
2. **Avoid deep cloning** of property structures
3. **Use immutable updates** for property changes
4. **Clean up unused properties** during workspace operations

## Error Handling

### Validation Errors
- **Invalid property structure** - TypeScript compilation errors
- **Invalid value types** - Runtime validation errors
- **Invalid theme references** - Theme resolution errors
- **Invalid computed properties** - Computation errors

### Graceful Degradation
- **Missing theme values** - Fallback to exact values
- **Invalid property values** - Use default values
- **Computation errors** - Fallback to parent values
- **Resolution failures** - Use platform defaults

### Debugging Support
- **Clear error messages** for invalid properties
- **Property resolution logging** for debugging
- **Theme reference validation** with helpful messages
- **Computation step logging** for complex properties

