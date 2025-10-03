# Core Helpers

This directory contains utility functions and helpers used throughout the Seldon core package. The helpers are organized into modules for different domains of functionality.

## Quick Start

### For Engineers
```typescript
import { 
  toHSLString, 
  modulate, 
  processNestedOverridesProps,
  resolveColor,
  invariant 
} from "@seldon/core/helpers"

// Color processing
const hsl = toHSLString('#ff0000') // "hsl(0, 100%, 50%)"

// Math operations
const mapped = modulate(50, [0, 100], [0, 1]) // 0.5

// Property processing
const processed = processNestedOverridesProps(childProps, overrides, 'Button')

// Validation
invariant(node !== null, 'Node must exist', { nodeId })
```

### For Designers
- **Color Helpers**: Convert between color formats, apply brightness, calculate contrast
- **Math Helpers**: Scale values, modulate ranges, round numbers
- **Property Helpers**: Process component properties and inheritance
- **Validation Helpers**: Ensure data integrity and type safety

## 📁 Directory Structure

```
helpers/
├── color/           # Color processing and conversion utilities
├── fixtures/        # Test fixtures and sample data
├── math/            # Mathematical operations and calculations
├── properties/      # Property processing and manipulation
├── resolution/      # Value resolution and computation
├── theme/           # Theme integration and migration utilities
├── type-guards/     # Type checking and validation functions
├── utils/           # General utility functions
└── validation/      # Input validation and sanitization
```

## 🎨 Color Helpers (`color/`)

Color processing utilities for converting between color formats and applying transformations.

### Key Functions

- **`toHSLString(value: string)`** - Convert color format to HSL string
- **`hexToHSLObject(value: string)`** - Convert hex color to HSL object
- **`rgbToHSL(rgb: RGB)`** - Convert RGB object to HSL object
- **`applyBrightness(color: string, brightness: number)`** - Apply brightness adjustment
- **`getContrastRatio(color1: string, color2: string)`** - Calculate contrast ratio between colors

### Usage Example

```typescript
import { toHSLString, applyBrightness, getContrastRatio } from '@seldon/core/helpers'

// Convert color formats
const hsl = toHSLString('#ff0000') // "hsl(0, 100%, 50%)"

// Apply brightness
const darker = applyBrightness('#ff0000', -20) // Darker red

// Check contrast
const ratio = getContrastRatio('#ffffff', '#000000') // 21
```

## 🔢 Math Helpers (`math/`)

Mathematical operations and calculations for design system values.

### Key Functions

- **`modulate(value: number, rangeA: [number, number], rangeB: [number, number])`** - Map value from one range to another
- **`modulateWithTheme(value: number, theme: Theme)`** - Modulate value using theme parameters
- **`round(value: number, precision?: number)`** - Round number to specified precision

### Usage Example

```typescript
import { modulate, round } from '@seldon/core/helpers'

// Map value between ranges
const mapped = modulate(50, [0, 100], [0, 1]) // 0.5

// Round to precision
const rounded = round(3.14159, 2) // 3.14
```

## 🏗️ Properties Helpers (`properties/`)

Property processing and manipulation utilities for component properties.

### Key Functions

- **`processNestedOverridesProps(properties, nestedOverrides, componentId)`** - Process parent-to-child property overrides
- **`flattenNestedOverridesObject(obj)`** - Flatten nested objects to dot notation
- **`removeAllowedValuesFromProperties(properties)`** - Remove allowed values from schema properties
- **`stringifyValue(value)`** - Convert property values to strings

### Usage Example

```typescript
import { processNestedOverridesProps } from '@seldon/core/helpers'

const childProperties = {
  fontSize: { type: 'exact', value: 16 },
  color: { type: 'theme', value: '@color.primary' }
}

const nestedOverrides = {
  'Button.fontSize': { type: 'exact', value: 18 }
}

const processed = processNestedOverridesProps(childProperties, nestedOverrides, 'Button')
// fontSize will be overridden to 18
```

## 🎯 Resolution Helpers (`resolution/`)

Value resolution and computation utilities for resolving theme values and computed properties.

### Key Functions

- **`resolveValue(value)`** - Resolve and validate property values
- **`resolveColor(value, theme)`** - Resolve color values from theme
- **`resolveFontSize(value, theme)`** - Resolve font size values
- **`resolveSize(value, theme)`** - Resolve size values
- **`resolveShadowBlur(value, theme)`** - Resolve shadow blur values

### Usage Example

```typescript
import { resolveColor, resolveFontSize } from '@seldon/core/helpers'

const color = resolveColor('@color.primary', theme) // "#007bff"
const fontSize = resolveFontSize('@fontSize.large', theme) // "1.25rem"
```

## 🎨 Theme Helpers (`theme/`)

Theme integration and migration utilities for working with design system themes.

### Key Functions

- **`getThemeOption(key, theme)`** - Get theme option by key
- **`getThemeKeyComponents(key)`** - Parse theme key components
- **`migrateNodePropertiesToTheme(nodeId, fromTheme, toTheme, workspace)`** - Migrate properties between themes

### Usage Example

```typescript
import { getThemeOption, migrateNodePropertiesToTheme } from '@seldon/core/helpers'

// Get theme option
const primaryColor = getThemeOption('@color.primary', theme)

// Migrate properties
const updatedWorkspace = migrateNodePropertiesToTheme(
  'node-123',
  'old-theme',
  'new-theme',
  workspace
)
```

## 🛡️ Type Guards (`type-guards/`)

Type checking and validation functions for runtime type safety.

### Key Functions

- **`isThemeValue(value)`** - Check if value is a theme value
- **`isCompoundValue(value)`** - Check if value is a compound property
- **`isEmptyValue(value)`** - Check if value is empty
- **`isHSLObject(value)`** - Check if value is HSL object
- **`isValidColorValue(value)`** - Validate color value format

### Usage Example

```typescript
import { isThemeValue, isCompoundValue } from '@seldon/core/helpers'

if (isThemeValue(propertyValue)) {
  // Handle theme value
  const resolved = resolveThemeValue(propertyValue, theme)
}

if (isCompoundValue(propertyValue)) {
  // Handle compound property
  Object.entries(propertyValue).forEach(([key, value]) => {
    // Process each sub-property
  })
}
```

## 🔧 Utils (`utils/`)

General utility functions for common operations.

### Key Functions

- **`invariant(condition, message, context?)`** - Assert condition with error handling
- **`createNodeId()`** - Generate unique node IDs
- **`findInObject(obj, predicate)`** - Find items in nested objects
- **`getGoogleFontURL(fontFamily)`** - Generate Google Fonts URL
- **`validateComponent(component)`** - Validate component structure

### Usage Example

```typescript
import { invariant, createNodeId, findInObject } from '@seldon/core/helpers'

// Assert conditions
invariant(node !== null, 'Node must exist', { nodeId })

// Generate IDs
const nodeId = createNodeId() // "node_abc123"

// Find in objects
const found = findInObject(workspace, (value, key) => key === 'target')
```

## ✅ Validation (`validation/`)

Input validation and sanitization utilities.

### Key Functions

- **`isValidColor(value)`** - Validate color string format
- **`isValidSize(value)`** - Validate size value format
- **`isValidURL(value)`** - Validate URL format
- **`isValidPercentage(value)`** - Validate percentage format
- **`isValidPositiveInteger(value)`** - Validate positive integer

### Usage Example

```typescript
import { isValidColor, isValidSize } from '@seldon/core/helpers'

if (isValidColor(userInput)) {
  // Process valid color
  const hsl = toHSLString(userInput)
}

if (isValidSize(userInput)) {
  // Process valid size
  const resolved = resolveSize(userInput, theme)
}
```

## 🧪 Test Fixtures (`fixtures/`)

Sample data and test fixtures for development and testing.

### Available Fixtures

- **`workspace.ts`** - Sample workspace data
- **`workspace-with-product-card.ts`** - Workspace with product card component
- **`workspace-with-properties.ts`** - Workspace with various properties
- **`nodes.ts`** - Sample node data

### Usage Example

```typescript
import { sampleWorkspace, workspaceWithProductCard } from '@seldon/core/helpers/fixtures'

// Use in tests
const workspace = sampleWorkspace()
const productCardWorkspace = workspaceWithProductCard()
```

## 📦 Importing Helpers

You can import helpers in several ways:

```typescript
// Import specific functions
import { toHSLString, modulate } from '@seldon/core/helpers'

// Import from specific modules
import { toHSLString } from '@seldon/core/helpers/color'
import { modulate } from '@seldon/core/helpers/math'

// Import all helpers
import * as helpers from '@seldon/core/helpers'
```

## 🎯 Best Practices

1. **Use type guards** for runtime type safety
2. **Validate inputs** before processing
3. **Use resolution helpers** for theme-dependent values
4. **Leverage fixtures** for consistent testing
5. **Prefer specific imports** over wildcard imports for better tree-shaking

## 🔄 Migration Notes

When migrating between themes or updating property structures:

1. Use `migrateNodePropertiesToTheme()` for theme migrations
2. Use `processNestedOverridesProps()` for property inheritance
3. Use `removeAllowedValuesFromProperties()` when cleaning schema properties
4. Use validation helpers to ensure data integrity

## 🐛 Error Handling

Most helpers include error handling:

- **`invariant()`** throws `InvariantError` with context
- **Color helpers** throw errors for invalid formats
- **Validation helpers** return boolean results
- **Resolution helpers** return `undefined` for invalid values

Always check return values and handle errors appropriately in your code.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Core Helpers System. When making changes to the helper functionality:

1. **Update this README first** to reflect the intended helper behavior and utility functions
2. **Implement changes** to match the documented specifications and helper patterns
3. **Update helper tests** to verify the documented behavior
4. **Validate that the helper functions** follow the documented utility patterns and error handling
5. **Ensure helper integration** maintains the documented usage patterns across the core system

The helpers system is designed to be:
- **Modular**: Organized into domain-specific modules for different functionality areas
- **Type-Safe**: Full TypeScript support with documented interfaces and type definitions
- **Utility-Focused**: Provides common operations and helper functions for the core system
- **Extensible**: Easy to add new helpers following documented patterns
- **Predictable**: Helper behavior should match documentation exactly
- **Validated**: Comprehensive error handling and input validation throughout
- **Consistent**: All helpers follow the documented utility patterns and naming conventions

### Helper Development Workflow

When creating or modifying helper functionality:

1. **Define Purpose**: Document the helper's role and utility in the core system
2. **Implement Function**: Create helper function with proper error handling and validation
3. **Add Tests**: Create comprehensive tests for the helper function
4. **Update Documentation**: Keep this README current with helper changes
5. **Verify Integration**: Ensure helpers work correctly with other core systems

### Helper Validation

All helpers must validate against documented specifications:
- **Function Signatures**: Must match documented TypeScript interfaces and parameter types
- **Error Handling**: Must implement documented error handling and validation patterns
- **Return Values**: Must follow documented return value specifications
- **Input Validation**: Must implement documented input validation and sanitization

This ensures consistency across the entire helpers system and maintains the reliability of utility functions throughout the core system.

For detailed implementation information, see the specific subsystem documentation:
- [Core README](../README.md) - Core engine and system integration
- [Properties README](../properties/README.md) - Property processing and manipulation
- [Themes README](../themes/README.md) - Theme integration and migration utilities
- [Compute README](../compute/README.md) - Value resolution and computation
- [Workspace README](../workspace/README.md) - Workspace state management and utilities
