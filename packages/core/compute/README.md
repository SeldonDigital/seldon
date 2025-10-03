# Seldon Compute System

The Seldon Compute System is a property computation engine that resolves design values through inheritance, theme integration, and mathematical calculations. It transforms computed properties into concrete values that can be used in CSS generation and component rendering.

## Quick Start

### For Engineers
```typescript
import { computeProperties, Sdn } from "@seldon/core"
import { ComputedFunction, ValueType } from "@seldon/core/properties/constants"

// Auto-fit computation
const properties = {
  buttonSize: { type: ValueType.EXACT, value: { unit: "rem", value: 2 } },
  iconSize: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.AUTO_FIT,
      input: { basedOn: "#buttonSize", factor: 0.8 }
    }
  }
}

const computed = computeProperties(properties, context)
// Result: iconSize = { type: ValueType.EXACT, value: { unit: "rem", value: 1.6 } }
```

### For Designers
- **4 Computation Functions**: AUTO_FIT, HIGH_CONTRAST_COLOR, OPTICAL_PADDING, MATCH
- **Property References**: Use `#parent.buttonSize` to reference other properties
- **Mathematical Operations**: Automatic scaling, contrast calculation, and value matching
- **Theme Integration**: Works seamlessly with theme values

## Architecture Overview

The compute system operates on a computation context that contains properties, parent contexts, and theme data. It processes computed values through a multi-stage pipeline that handles inheritance, theme resolution, and mathematical operations.

### Core Components

1. **Property Computation** (`compute-properties.ts`) - Main orchestration function
2. **Computed Functions** - Individual computation engines for different value types
3. **Context Resolution** (`get-based-on-value.ts`) - Handles property inheritance and resolution
4. **Type System** (`types.ts`) - Defines computation context and key structures

## Computation Functions

The system currently supports four main computation functions, each designed for specific design scenarios.

### 1. Auto Fit (`compute-auto-fit.ts`)

Scales values proportionally based on a reference value and factor.

```typescript
export function computeAutoFit(
  value: ComputedAutoFitValue,
  context: ComputeContext,
): Value
```

**Use Cases:**
- Scaling button sizes relative to font size
- Creating proportional spacing systems
- Maintaining aspect ratios across different screen sizes

**Example:**
```typescript
const properties = {
  buttonSize: {
    type: ValueType.EXACT,
    value: { unit: Unit.REM, value: 100 },
  },
  size: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.AUTO_FIT,
      input: {
        basedOn: "#buttonSize",
        factor: 0.8, // 80% of button size
      },
    },
  },
}

// Result: { type: ValueType.EXACT, value: { unit: Unit.REM, value: 80 } }
```

**Supported Input Types:**
- **Exact Values**: Direct number or unit values
- **Theme Values**: Font size and other theme-based values
- **Unit Values**: Pixels, rems, percentages, etc.

### 2. High Contrast Color (`compute-high-contrast-color.ts`)

Generates high-contrast colors based on background colors and brightness adjustments.

```typescript
export function computeHighContrastColor(
  value: ComputedHighContrastValue,
  context: ComputeContext,
): Value
```

**Use Cases:**
- Text color selection for readability
- Dynamic color schemes based on background
- Accessibility-compliant color combinations

**Example:**
```typescript
const properties = {
  background: {
    color: {
      type: ValueType.EXACT,
      value: "#000000", // Black background
    },
    brightness: {
      type: ValueType.EXACT,
      value: { value: 20, unit: Unit.PERCENT }, // 20% lighter
    },
  },
  textColor: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.HIGH_CONTRAST_COLOR,
      input: {
        basedOn: "#background.color",
      },
    },
  },
}

// Result: { type: ValueType.EXACT, value: { hue: 18, lightness: 98, saturation: 12 } }
// (Light color for dark background)
```

**Features:**
- **Brightness Awareness**: Considers brightness adjustments when determining contrast
- **Parent Context Support**: Can reference parent component colors
- **Theme Integration**: Uses theme swatches for consistent color application
- **Detection**: Determines if background is light or dark

### 3. Optical Padding (`compute-optical-padding.ts`)

Calculates visually balanced padding values based on typography and design principles.

```typescript
export function computeOpticalPadding(
  value: ComputedOpticalPaddingValue,
  context: ComputeContext,
  keys: ComputeKeys,
): Value
```

**Use Cases:**
- Creating visually balanced button padding
- Typography-based spacing systems
- Consistent visual rhythm across components

**Example:**
```typescript
const properties = {
  lines: { type: ValueType.EXACT, value: 10 },
  padding: {
    top: {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#lines", factor: 2 },
      },
    },
  },
}

// Result: { type: ValueType.EXACT, value: 8 }
// (Optically balanced padding based on line height)
```

**Side-Specific Ratios:**
- **Left**: 0.64 ratio (slightly less padding)
- **Right**: 0.8 ratio (moderate padding)
- **Top/Bottom**: 0.4 ratio (minimal vertical padding)

**Supported Input Types:**
- **Exact Values**: Direct number or unit values
- **Theme Values**: Font size and typography-based values
- **Unit Values**: Pixels, rems, etc.

### 4. Match (`compute-match.ts`)

Copies values from other properties, enabling property inheritance and value sharing.

```typescript
export function computeMatch(
  value: ComputedMatchValue,
  context: ComputeContext,
): Value
```

**Use Cases:**
- Property inheritance between components
- Value sharing across design tokens
- Simplifying property management

**Example:**
```typescript
const properties = {
  primaryColor: {
    type: ValueType.EXACT,
    value: "#3b82f6",
  },
  accentColor: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.MATCH,
      input: {
        basedOn: "#primaryColor",
      },
    },
  },
}

// Result: { type: ValueType.EXACT, value: "#3b82f6" }
// (Accent color matches primary color)
```

## Context Resolution

### Compute Context

The computation context provides the environment for all computations:

```typescript
export type ComputeContext = {
  properties: Properties        // Current component properties
  parentContext: ComputeContext | null  // Parent component context
  theme: Theme                 // Theme data and tokens
}
```

### Property Resolution (`get-based-on-value.ts`)

Handles complex property inheritance and resolution:

```typescript
export function getBasedOnValue(
  computedValue: ComputedValue,
  context: Omit<ComputeContext, "theme">,
): PrimitiveValue
```

**Features:**
- **Parent Context Traversal**: Walks up the component hierarchy
- **Transparent Value Handling**: Skips transparent values in inheritance chain
- **Property Path Resolution**: Supports dot notation for nested properties
- **Error Handling**: Provides detailed error messages for missing values

**Property Path Examples:**
- `#color` - References current component's color property
- `#parent.color` - References parent component's color property
- `#parent.background.color` - References nested property in parent

## Main Computation Pipeline

### Property Computation (`compute-properties.ts`)

The main orchestration function that processes all properties in a component:

```typescript
export function computeProperties(
  properties: Properties,
  context: ComputeContext,
): Properties
```

**Process Flow:**
1. **Property Iteration**: Processes each property in the component
2. **Compound Property Handling**: Handles nested properties (padding.top, margin.left, etc.)
3. **Computed Value Detection**: Identifies properties with computed values
4. **Function Routing**: Routes to appropriate computation function
5. **Result Integration**: Integrates computed values back into properties

**Compound Property Support:**
- **Padding**: `padding.top`, `padding.right`, `padding.bottom`, `padding.left`
- **Margin**: `margin.top`, `margin.right`, `margin.bottom`, `margin.left`
- **Border**: `border.width`, `border.color`, `border.style`
- **Background**: `background.color`, `background.image`, `background.size`

## Usage Examples

### Basic Property Computation

```typescript
import { computeProperties } from '@seldon/core/compute'
import { ComputedFunction, ValueType } from '@seldon/core'

const properties = {
  fontSize: {
    type: ValueType.EXACT,
    value: { unit: Unit.REM, value: 1.5 },
  },
  buttonSize: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.AUTO_FIT,
      input: {
        basedOn: "#fontSize",
        factor: 2.5,
      },
    },
  },
  padding: {
    top: {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: {
          basedOn: "#fontSize",
          factor: 1.5,
        },
      },
    },
  },
}

const context = {
  properties,
  parentContext: null,
  theme: myTheme,
}

const computedProperties = computeProperties(properties, context)
```

### Advanced Inheritance

```typescript
// Parent component
const parentProperties = {
  primaryColor: {
    type: ValueType.EXACT,
    value: "#3b82f6",
  },
  textSize: {
    type: ValueType.EXACT,
    value: { unit: Unit.REM, value: 1.2 },
  },
}

// Child component
const childProperties = {
  textColor: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.MATCH,
      input: {
        basedOn: "#parent.primaryColor",
      },
    },
  },
  buttonSize: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.AUTO_FIT,
      input: {
        basedOn: "#parent.textSize",
        factor: 3,
      },
    },
  },
}

const childContext = {
  properties: childProperties,
  parentContext: {
    properties: parentProperties,
    parentContext: null,
    theme: myTheme,
  },
  theme: myTheme,
}

const computedChildProperties = computeProperties(childProperties, childContext)
```

### Theme Integration

```typescript
const properties = {
  baseSize: {
    type: ValueType.THEME_ORDINAL,
    value: "@fontSize.medium",
  },
  scaledSize: {
    type: ValueType.COMPUTED,
    value: {
      function: ComputedFunction.AUTO_FIT,
      input: {
        basedOn: "#baseSize",
        factor: 1.5,
      },
    },
  },
  padding: {
    top: {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: {
          basedOn: "#baseSize",
          factor: 2,
        },
      },
    },
  },
}
```

## Advanced Features

### 1. Multi-Level Inheritance

The system supports multiple levels of property inheritance:

```typescript
// Grandparent -> Parent -> Child inheritance
const grandparentContext = { /* ... */ }
const parentContext = { 
  parentContext: grandparentContext,
  /* ... */ 
}
const childContext = { 
  parentContext: parentContext,
  /* ... */ 
}
```

### 2. Transparent Value Handling

Skips transparent values in inheritance chains:

```typescript
// If parent has transparent color, system looks at grandparent
const parentProperties = {
  color: {
    type: ValueType.EXACT,
    value: "transparent",
  },
}
```

### 3. Error Handling

Error handling with detailed messages:

```typescript
// Throws: "Based on value not found for #missingProperty"
// Throws: "Failed to compute autoFit from theme value, because theme value @color.primary is not fontSize"
// Throws: "The value being matched cannot be a computed value"
```

### 4. Type Safety

TypeScript support with strict typing:

```typescript
// All computation functions are fully typed
const result: Value = computeAutoFit(autoFitValue, context)
const result: Value = computeHighContrastColor(contrastValue, context)
const result: Value = computeOpticalPadding(paddingValue, context, keys)
const result: Value = computeMatch(matchValue, context)
```

## Testing

The compute system includes test coverage:

```typescript
// Test individual computation functions
import { computeAutoFit } from './compute-auto-fit'
import { computeHighContrastColor } from './compute-high-contrast-color'
import { computeOpticalPadding } from './compute-optical-padding'
import { computeMatch } from './compute-match'

// Test the main computation pipeline
import { computeProperties } from './compute-properties'
```

**Test Coverage:**
- **Unit Tests**: Individual function testing
- **Integration Tests**: Full pipeline testing
- **Edge Cases**: Error conditions and boundary values
- **Theme Integration**: Theme-based computation testing
- **Inheritance**: Multi-level inheritance testing

## Performance Considerations

### Optimization Strategies

1. **Lazy Evaluation**: Computed values are only calculated when needed
2. **Caching**: Results can be cached for repeated computations
3. **Inheritance Optimization**: Efficient parent context traversal
4. **Type Checking**: Early validation prevents unnecessary computation

### Best Practices

1. **Minimize Computed Values**: Use computed values only when necessary
2. **Optimize Inheritance Chains**: Keep inheritance chains as short as possible
3. **Theme Integration**: Leverage theme values for consistency
4. **Error Handling**: Always handle computation errors gracefully

## Integration with Factory System

The compute system integrates seamlessly with the Seldon Factory:

```typescript
// Factory usage
import { computeWorkspace } from '@seldon/core/helpers/compute-workspace'
import { exportWorkspace } from '@seldon/factory'

// 1. Compute all properties in workspace
const computedWorkspace = computeWorkspace(workspace)

// 2. Export to production-ready code
const files = await exportWorkspace(computedWorkspace, options)
```

This ensures that all computed values are resolved before CSS generation and component creation, providing a complete and consistent design system.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Seldon Compute System. When making changes to the compute functionality:

1. **Update this README first** to reflect the intended computation behavior and processing workflow
2. **Implement changes** to match the documented specifications and computation functions
3. **Update compute tests** to verify the documented behavior
4. **Validate that the computation pipeline** follows the documented workflow from property computation through context resolution
5. **Ensure computation functions** maintain the documented mathematical calculations and inheritance patterns

The compute system is designed to be:
- **Mathematical**: Uses documented mathematical operations and calculations for value computation
- **Inheritance-Aware**: Handles property inheritance and context resolution through documented patterns
- **Function-Based**: Implements documented computation functions (AUTO_FIT, HIGH_CONTRAST_COLOR, OPTICAL_PADDING, MATCH)
- **Context-Driven**: Uses documented computation context for property resolution and inheritance
- **Extensible**: Easy to add new computation functions following documented patterns
- **Predictable**: Computation behavior should match documentation exactly
- **Validated**: Comprehensive error handling and mathematical validation throughout

### Compute Development Workflow

When creating or modifying compute functionality:

1. **Define Computation Function**: Document the mathematical operation and use cases
2. **Implement Function**: Create computation function with proper error handling and validation
3. **Add Context Support**: Ensure function works with documented computation context
4. **Test Integration**: Verify computation functions work with property processing pipeline
5. **Update Documentation**: Keep this README current with compute changes

### Computation Validation

All computation functions must validate against documented specifications:
- **Mathematical Operations**: Must implement documented mathematical calculations and formulas
- **Context Resolution**: Must follow documented property inheritance and context resolution patterns
- **Error Handling**: Must implement documented error handling for invalid inputs and calculations
- **Type Safety**: Must maintain documented TypeScript interfaces and return value types

This ensures consistency across the entire compute system and maintains the reliability of property computation throughout the design system.

For detailed implementation information, see the specific subsystem documentation:
- [Core README](../README.md) - Core engine and system integration
- [Properties README](../properties/README.md) - Property system and value types
- [Themes README](../themes/README.md) - Theme integration and design tokens
- [Helpers README](../helpers/README.md) - Utility functions and mathematical operations
- [Workspace README](../workspace/README.md) - Workspace state management and property processing
- [Factory README](../../factory/README.md) - Code generation and export systems
