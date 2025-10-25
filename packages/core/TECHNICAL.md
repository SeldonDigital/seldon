# Seldon Core - Technical Reference

This document contains all code examples, type definitions, and technical implementation details for the Seldon Core Engine.

## Installation and Setup

### For Engineers
```typescript
import { Component, Workspace, Sdn } from "@seldon/core"

// Create a simple component
const button: Component = {
  component: Sdn.ComponentId.BUTTON,
  properties: {
    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
  }
}

// Create a workspace
const workspace: Workspace = {
  version: 1,
  boards: {},
  byId: {},
  customTheme: customTheme
}
```

### For Designers
- **Components**: Choose from 5 levels (Screen → Module → Part → Element → Primitive) plus Frame containers
- **Themes**: Select from 10+ predefined themes or create custom ones
- **Properties**: Use theme references like `@swatch.primary` for consistent styling
- **Inheritance**: Child components automatically inherit parent styling

## Component System

### Component Creation
```typescript
import { Component, Seldon, Sdn } from "@seldon/core"

// Create a simple button component
const button: Component = {
  component: Seldon.ComponentId.BUTTON,
  properties: {
    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
  }
}

// Create a card with nested components
const card: Component = {
  component: Seldon.ComponentId.CARD_HORIZONTAL,
  children: [
    { component: Seldon.ComponentId.BUTTON },
    { component: Seldon.ComponentId.TEXT }
  ]
}
```

### Component Hierarchy Examples
```typescript
// ✅ Valid: Button (ELEMENT) containing Icon (PRIMITIVE)
{
  component: Seldon.ComponentId.BUTTON,
  children: [{
    component: Seldon.ComponentId.ICON  // PRIMITIVE in ELEMENT
  }]
}

// ✅ Valid: Card (PART) containing Button (ELEMENT) and Text (PRIMITIVE)
{
  component: Seldon.ComponentId.CARD_HORIZONTAL,
  children: [
    { component: Seldon.ComponentId.BUTTON },    // ELEMENT in PART
    { component: Seldon.ComponentId.TEXT }       // PRIMITIVE in PART
  ]
}

// ❌ Invalid: Text (PRIMITIVE) cannot have children
{
  component: Seldon.ComponentId.TEXT,
  children: [{ component: Seldon.ComponentId.ICON }]  // ERROR: PRIMITIVE cannot contain children
}
```

## Properties System

### Basic Property Usage
```typescript
import { Properties, ValueType } from "@seldon/core"

// Atomic property
const color: Properties = {
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
}

// Compound property
const layout: Properties = {
  margin: {
    top: { type: ValueType.THEME_ORDINAL, value: "@margin.medium" },
    bottom: { type: ValueType.EXACT, value: { unit: "px", value: 16 } }
  }
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

### Compound Properties

#### Background Properties
```typescript
background: {
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
  opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 90 } },
  image: { type: ValueType.EXACT, value: "url('/pattern.jpg')" },
  position: { type: ValueType.PRESET, value: BackgroundPosition.CENTER },
  size: { type: ValueType.PRESET, value: "cover" }
}
```

#### Border Properties
```typescript
border: {
  width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.thin" },
  style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.border" },
  opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 80 } }
}
```

#### Spacing Properties
```typescript
margin: {
  top: { type: ValueType.THEME_ORDINAL, value: "@margin.medium" },
  right: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 16 } },
  bottom: { type: ValueType.THEME_ORDINAL, value: "@margin.medium" },
  left: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 16 } }
}
```

### Override System

#### Nested Override Example
```typescript
// BAR_BUTTONS component with nested overrides
{
  component: ComponentId.BAR_BUTTONS,
  children: [
    {
      component: ComponentId.BUTTON,
      nestedOverrides: {
        icon: { symbol: "material-add" },
        label: { content: "Add Item" },
        background: { color: "@swatch.primary" }
      }
    }
  ]
}
```

#### Flattening Process
```typescript
// Nested syntax (what designers write)
{
  icon: { symbol: "material-add" },
  label: { content: "Add Item" }
}

// Flattened syntax (what the system processes)
{
  "icon.symbol": "material-add",
  "label.content": "Add Item"
}
```

## Themes System

### Basic Theme Usage
```typescript
import { Theme, stockThemes } from "@seldon/core"

// Use a predefined theme
const theme: Theme = stockThemes.material

// Access theme values
const primaryColor = theme.swatch.primary.value // "#3f51b5"
const fontSize = theme.fontSize.medium.value    // "1rem"
```

### Theme Structure
```typescript
interface StaticTheme {
  id: string
  name: string
  description: string
  intent: string
  core: {
    ratio: Ratio
    fontSize: number
    size: number
  }
  fontFamily: {
    primary: string
    secondary: string
  }
  color: {
    baseColor: HSL
    harmony: Harmony
    angle: number
    step: number
    whitePoint: number
    grayPoint: number
    blackPoint: number
    bleed: number
    contrastRatio: number
  }
  // ... additional theme sections
}
```

## Workspace System

### Workspace Structure
```typescript
const workspace: Workspace = {
  version: 1,
  customTheme: customTheme,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      label: "Buttons",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default", "variant-button-custom"]
    }
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      type: "defaultVariant",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {},
      children: ["child-icon-1", "child-label-1"]
    },
    "child-icon-1": {
      id: "child-icon-1",
      type: "defaultVariant",
      component: ComponentId.ICON,
      level: ComponentLevel.ELEMENT,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
      children: []
    }
  }
}
```

### Mutation System Examples

#### Property Setting
```typescript
// Property changes typically use none propagation
setProperties: {
  board: { allowed: true, propagation: "none" },
  userVariant: { allowed: true, propagation: "none" },
  defaultVariant: { allowed: true, propagation: "none" },
  instance: { allowed: true, propagation: "none" }
}
```

#### Theme Setting
```typescript
// Theme changes typically use downstream propagation
setTheme: {
  board: { allowed: true, propagation: "downstream" },
  userVariant: { allowed: true, propagation: "downstream" },
  defaultVariant: { allowed: true, propagation: "downstream" },
  instance: { allowed: true, propagation: "downstream" }
}
```

#### Component Level Hierarchy
```typescript
componentLevels: {
  [ComponentLevel.PRIMITIVE]: { mayContain: [] },
  [ComponentLevel.ELEMENT]: {
    mayContain: [PRIMITIVE, ELEMENT, FRAME]
  },
  [ComponentLevel.PART]: {
    mayContain: [PRIMITIVE, ELEMENT, PART, FRAME]
  },
  [ComponentLevel.MODULE]: {
    mayContain: [PRIMITIVE, ELEMENT, PART, MODULE, FRAME]
  },
  [ComponentLevel.SCREEN]: {
    mayContain: [PRIMITIVE, ELEMENT, PART, MODULE, FRAME, SCREEN]
  },
  [ComponentLevel.FRAME]: {
    mayContain: [PRIMITIVE, ELEMENT, PART, MODULE, FRAME]
  }
}
```

## Usage

### Basic Import
```typescript
import { Component, Instance, Variant, Workspace } from "@seldon/core"
```

### Type Definitions
```typescript
import { ComponentId } from "@seldon/core/components/constants"
import { BackgroundPosition } from "@seldon/core/properties/constants/background-positions"
import { BorderStyle } from "@seldon/core/properties/constants/border-styles"
import { ComputedFunction } from "@seldon/core/properties/values/shared/computed/computed-functions"
import { Unit } from "@seldon/core/properties/constants/units"
import { ValueType } from "@seldon/core/properties/constants/value-types"
```

## Best Practices

### Workspace Management

#### ✅ DO
- Use variants as reusable templates, instances for actual usage
- Respect the workspace → boards → variants → instances hierarchy
- Validate workspace operations before execution
- Use middleware pipeline for validation and verification
- Understand how changes propagate between variants and instances
- Ensure workspace integrity after all operations

#### ❌ DON'T
- Modify variants with active instances without considering propagation
- Skip validation middleware in production
- Ignore workspace validation errors
- Create circular dependencies between components
- Ignore workspace version migrations

### Property System

#### ✅ DO
- Use defined property types and value constraints
- Ensure properties match their schema definitions
- Use theme references for consistent styling
- Understand property inheritance between variants and instances
- Implement computed properties for dynamic behavior

#### ❌ DON'T
- Use property types not defined in the schema
- Use values outside the allowed restrictions
- Skip property validation
- Create invalid theme or computed property references

### Theme System

#### ✅ DO
- Start with predefined themes before creating custom ones
- Ensure all theme values follow the design system
- Reference theme values consistently across components
- Ensure all theme values are valid and accessible
- Understand how themes propagate through the component hierarchy

#### ❌ DON'T
- Create themes that break design system consistency
- Reference non-existent theme values
- Skip theme validation
- Create circular references in theme definitions

### Compute System

#### ✅ DO
- Implement computed properties for dynamic calculations
- Ensure computed property references are valid
- Understand how computed properties inherit from parent components
- Use mathematical calculations for responsive behavior
- Verify computed property calculations are correct

#### ❌ DON'T
- Reference non-existent properties in computations
- Skip validation of computed property calculations
- Create circular references in computed properties
- Skip validation of mathematical operations

### General Core System

#### ✅ DO
- Use TypeScript types and interfaces
- Validate all operations before execution
- Implement proper error handling and recovery
- Use middleware system for cross-cutting concerns
- Keep documentation current with system changes
- Implement comprehensive tests for all core functionality

#### ❌ DON'T
- Use `any` types or skip type checking
- Ignore or suppress errors
- Bypass validation in any core operations
- Create APIs that break established patterns
- Ignore performance implications of core operations

### Development Workflow

1. Document intended changes before implementation
2. Update TypeScript types first
3. Add proper validation for all new functionality
4. Implement comprehensive tests
5. Keep all documentation current
6. Ensure changes work with all subsystems
