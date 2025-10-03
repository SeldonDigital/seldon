# Seldon Core Engine - LLM Reference

## Quick Start for LLMs

**Core Purpose**: Type-safe design system architecture providing component management, property computation, theme integration, and workspace state management with intelligent property inheritance and computed values.

**Key Systems**:

- **Properties**: Type-safe design tokens with 7 value types and compound properties
- **Themes**: Dynamic color generation with predefined and custom themes
- **Compute**: Property inheritance and mathematical calculations
- **Workspace**: Hierarchical component state management
- **Rules**: Authorization and operation control with propagation patterns

## Component Hierarchy (CRITICAL)

```
SCREEN (highest) → MODULE → PART → ELEMENT → PRIMITIVE (lowest)
FRAME (special - can contain anything at any level)
```

**Rules**: Components can only contain equal/lower levels. Primitives cannot have children.

## Value Types (ESSENTIAL)

| Type                | Usage              | Example                                  |
| ------------------- | ------------------ | ---------------------------------------- |
| `EXACT`             | Direct values      | `"#ff0000"`, `16`, `true`                |
| `PRESET`            | Predefined options | `"material-add"`, `"__default__"`        |
| `THEME_CATEGORICAL` | Theme colors       | `"@swatch.primary"`                      |
| `THEME_ORDINAL`     | Theme sizes        | `"@fontSize.large"`                      |
| `COMPUTED`          | Calculated values  | `{ function: "AUTO_FIT", input: {...} }` |
| `EMPTY`             | Unset values       | `null`                                   |
| `INHERIT`           | Inherited values   | `"inherit"`                              |

## Property Structure

```typescript
interface Property {
  type: ValueType
  value: any
  restrictions?: { allowedValues?: any[] }
}
```

## Compound Properties

### Background Properties

```typescript
background: {
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
  opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 90 } },
  image: { type: ValueType.EXACT, value: "url('/pattern.jpg')" },
  position: { type: ValueType.PRESET, value: BackgroundPosition.CENTER },
  size: { type: ValueType.PRESET, value: "cover" }
}
```

### Border Properties

```typescript
border: {
  width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.thin" },
  style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.border" },
  opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 80 } }
}
```

### Spacing Properties

```typescript
margin: {
  top: { type: ValueType.THEME_ORDINAL, value: "@margin.medium" },
  right: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 16 } },
  bottom: { type: ValueType.THEME_ORDINAL, value: "@margin.medium" },
  left: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 16 } }
}
```

## Override System

### Schema Overrides

Property overrides defined in component schemas. These are part of the component definition and specify default property values for child components.

### Nested Overrides (Runtime)

Parent components can modify child component properties during node instantiation. These are applied at runtime when components are created from schemas and **become regular overrides** on the child component once instantiated.

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

## Compute System

### Computation Functions

| Function              | Purpose                           | Example                                 |
| --------------------- | --------------------------------- | --------------------------------------- |
| `AUTO_FIT`            | Scale values proportionally       | `{ basedOn: "#fontSize", factor: 2.5 }` |
| `HIGH_CONTRAST_COLOR` | Generate accessible colors        | `{ basedOn: "#background.color" }`      |
| `OPTICAL_PADDING`     | Calculate balanced padding        | `{ basedOn: "#fontSize", factor: 1.5 }` |
| `MATCH`               | Copy values from other properties | `{ basedOn: "#primaryColor" }`          |

### Context Resolution

The compute system operates within a context that includes:

- **Current Component**: Immediate properties of the component
- **Parent Components**: Properties inherited from parent components
- **Theme System**: Values resolved from the current theme
- **Computed Values**: Values calculated from other properties

## Theme System

**Stock Themes**: default, earth, industrial, material, pop, royal-azure, seldon, sky, sunset-blue, wildberry
**Custom Themes**: User-defined with dynamic color generation
**Color Harmonies**: Complementary, SplitComplementary, Triadic, Analogous, Square, Monochromatic

**Key Features**:

- Dynamic color generation using color theory algorithms
- Predefined stock themes with consistent design tokens
- Theme-aware property references (`@swatch.*`, `@fontSize.*`, etc.)
- Extensible theme architecture for custom themes

## Workspace State Management

### Dual Reducer System

- **Core Reducer**: Handles direct user interactions—immediate, precise, and predictable
- **AI Reducer**: Handles AI-generated actions—batch processing with intelligent reconciliation

### Middleware Pipeline

Every action passes through a middleware pipeline:

1. **Validation Middleware**: Ensures action payloads are valid
2. **Sentry Breadcrumb Middleware**: Logs actions for debugging
3. **Action Processing**: Core reducer logic with rules-based authorization
4. **Migration Middleware**: Applies necessary data migrations
5. **Verification Middleware**: Validates workspace integrity
6. **Debug Logging**: Development-only logging of state changes

### Rules-Based Authorization System

The system includes a comprehensive rules system that controls operations:

- **Component Level Rules**: Enforce hierarchy constraints
- **Mutation Rules**: Control operations per entity type
- **Propagation Types**: Control how changes flow through the system

## Mutation System

### Entity Type Hierarchy

The mutation system operates on four distinct entity types:

#### 1. Board

Top-level containers that hold all variants of a component type:

- **Creation**: Allowed - new component types can be added
- **Deletion**: Allowed with downstream propagation - removing a board affects all its variants
- **Property Setting**: Allowed with no propagation - board properties don't affect variants
- **Theme Setting**: Allowed with downstream propagation - board themes affect all variants
- **Renaming**: Not allowed - board names are system-managed
- **Reordering**: Allowed - boards can be reordered in the workspace

#### 2. User Variant

Custom creations that extend or modify the default behavior:

- **Creation**: Allowed - users can create custom variants
- **Deletion**: Allowed with downstream propagation - affects all instances
- **Property Setting**: Allowed with no propagation - properties are overrides
- **Theme Setting**: Allowed with downstream propagation - themes affect instances
- **Renaming**: Allowed with downstream propagation - name changes affect instances
- **Reordering**: Allowed - variants can be reordered within boards

#### 3. Default Variant

System-generated from schemas and represent the canonical form:

- **Creation**: Not allowed - only system can create default variants
- **Deletion**: Not allowed - default variants are protected
- **Property Setting**: Allowed with no propagation - can be customized
- **Theme Setting**: Allowed with downstream propagation - themes affect instances
- **Renaming**: Not allowed - default variant names are system-managed
- **Reordering**: Not allowed - default variants maintain their position

#### 4. Instance

Actual components that exist within other components:

- **Creation**: Allowed with downstream propagation - affects child instances
- **Deletion**: Allowed with conditional behavior - schema-defined instances are hidden, manually-added instances are deleted
- **Property Setting**: Allowed with no propagation - properties are overrides
- **Theme Setting**: Allowed with downstream propagation - themes affect child instances
- **Renaming**: Not allowed - instance names are system-managed
- **Reordering**: Allowed with downstream propagation - affects child instances
- **Moving**: Allowed with downstream propagation - can be moved between parents

### Propagation System

#### None Propagation

Changes apply only to the target node:

```typescript
// Property changes typically use none propagation
setProperties: {
  board: { allowed: true, propagation: "none" },
  userVariant: { allowed: true, propagation: "none" },
  defaultVariant: { allowed: true, propagation: "none" },
  instance: { allowed: true, propagation: "none" }
}
```

#### Downstream Propagation

Changes flow from variants to their instances:

```typescript
// Theme changes typically use downstream propagation
setTheme: {
  board: { allowed: true, propagation: "downstream" },
  userVariant: { allowed: true, propagation: "downstream" },
  defaultVariant: { allowed: true, propagation: "downstream" },
  instance: { allowed: true, propagation: "downstream" }
}
```

### Component Level Hierarchy

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

## Type Safety System

The Seldon Core Engine is built with comprehensive type safety throughout. Every property, value, and relationship is typed and validated.

### Property Keys

All property keys are strongly typed, ensuring that only valid properties can be set on components.

### Property Paths

Property paths support dot notation for compound properties, allowing navigation of complex property hierarchies with type safety.

### Value Types

Every value has a type that carries semantic meaning. A color value is a `ColorValue` that could be a theme reference, an exact color, or a computed value.

## Integration Points

### Factory System Integration

The core engine integrates with the factory system to transform workspaces into production-ready code. The compute system ensures that all computed values are resolved before CSS generation and component creation.

### Component System Integration

The core engine provides the foundation for the component system, defining the schemas, properties, and relationships that components use.

### AI System Integration

The core engine includes AI integration, with reference-based targeting, schema-workspace reconciliation, and intelligent variant creation.

## LLM Guidelines

### ✅ DO

- Use TypeScript interfaces and types
- Check rules before operations
- Use Immer for immutable updates
- Respect component hierarchy constraints
- Handle theme value resolution
- Use reference IDs (`$ref1.0.1`) for AI targeting
- Validate inputs before processing
- Understand variant vs instance relationships before making changes
- Use appropriate action types for the intended operation
- Consider propagation effects when modifying variants
- Validate workspace operations before execution
- Use middleware pipeline for validation and verification
- Handle propagation between variants and instances correctly
- Preserve workspace integrity after all operations

### ❌ DON'T

- Mutate workspace objects directly
- Ignore component level constraints
- Skip property validation
- Use computed values excessively
- Forget to handle missing nodes
- Create invalid component relationships
- Modify variants that have active instances without considering propagation
- Bypass validation middleware in production
- Ignore workspace validation errors
- Create circular references between components
- Skip workspace version migrations
- Use invalid action payloads
- Ignore component hierarchy rules

## Common Patterns

**Property Definition**:

```typescript
const property: Property = {
  type: ValueType.THEME_CATEGORICAL,
  value: "@swatch.primary",
  restrictions: {
    allowedValues: ["@swatch.primary", "@swatch.secondary"],
  },
}
```

**Computed Property**:

```typescript
const computedProperty: Property = {
  type: ValueType.COMPUTED,
  value: {
    function: ComputedFunction.AUTO_FIT,
    input: {
      basedOn: "#fontSize",
      factor: 2.5,
    },
  },
}
```

**Theme Reference**:

```typescript
const themeProperty: Property = {
  type: ValueType.THEME_ORDINAL,
  value: "@fontSize.large",
}
```

## Quick Reference

**Core Imports**:

```typescript
import { Component, Instance, Variant, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import {
  ComputedFunction,
  Unit,
  ValueType,
} from "@seldon/core/properties/constants"
import {
  BackgroundPosition,
  BorderStyle,
} from "@seldon/core/properties/constants"
```

**Common Patterns**:

- Theme values: `@swatch.primary`, `@fontSize.large`
- Computed properties: `{ function: "AUTO_FIT", input: {...} }`
- Compound properties: `background.color`, `border.width`
- Nested overrides: `icon.symbol`, `label.content`
