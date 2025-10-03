# @seldon/core

The Seldon Core Engine provides type-safe design system architecture with component management, property computation, theme integration, and workspace state management. It uses a hierarchical component structure with property inheritance and computed values.

## Quick Start

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
- **Components**: Choose from 6 levels (Screen → Module → Part → Element → Primitive)
- **Themes**: Select from 10+ predefined themes or create custom ones
- **Properties**: Use theme references like `@swatch.primary` for consistent styling
- **Inheritance**: Child components automatically inherit parent styling

## Architecture Overview

The system organizes components into a six-level hierarchy:

```
SCREEN (highest) → MODULE → PART → ELEMENT → PRIMITIVE (lowest)
FRAME (special - can contain anything at any level)
```

### Component Hierarchy Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        SCREEN                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    MODULE                           │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │                  PART                       │    │    │
│  │  │  ┌─────────────────────────────────────┐    │    │    │
│  │  │  │              ELEMENT               │    │    │    │
│  │  │  │  ┌─────────────────────────────┐    │    │    │    │
│  │  │  │  │         PRIMITIVE           │    │    │    │    │
│  │  │  │  │  (Text, Icon, Image)        │    │    │    │    │
│  │  │  │  └─────────────────────────────┘    │    │    │    │
│  │  │  └─────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        FRAME                                │
│  (Can contain any component level - special exception)      │
└─────────────────────────────────────────────────────────────┘
```

- **Screen**: Full page layouts
- **Module**: Major sections (headers, sidebars)
- **Part**: Complex components (cards, forms)
- **Element**: Simple components (buttons, inputs)
- **Primitive**: Atomic building blocks (text, icons, images)
- **Frame**: Universal container that can hold any component level

## Core Subsystems

### Workspace System

The Core Workspace System provides state management for component-based workspaces with a hierarchical architecture:

- **Workspaces** contain multiple **Boards** (one per component type)
- **Boards** contain multiple **Variants** (default and user-created)
- **Variants** can contain **Instances** (child components)
- **Instances** can contain other **Instances** (nested components)

The workspace system handles:

- Component instantiation and hierarchy management
- Property propagation between variants and instances
- Theme management and custom theme creation
- AI-driven workspace modifications
- Validation and middleware systems

For detailed workspace documentation, see [packages/core/workspace/README.md](./workspace/README.md).

### Properties System

Type-safe property definitions and validation for all design system components with seven value types:

1. **EXACT**: Direct values (`#ff0000`, `16px`, `true`)
2. **PRESET**: Predefined options (`"material-add"`, `"__default__"`)
3. **THEME_CATEGORICAL**: Theme colors (`"@swatch.primary"`)
4. **THEME_ORDINAL**: Theme dimensions (`"@fontSize.large"`)
5. **COMPUTED**: Calculated values based on other properties
6. **EMPTY**: Unset values (distinct from null/undefined)
7. **INHERIT**: Values inherited from parent components

For detailed property system documentation, see [packages/core/properties/README.md](./properties/README.md).

### Themes System

Theming with predefined themes, dynamic color generation, and custom theme creation. Includes design tokens for colors, typography, spacing, and visual effects.

**Key Features**:

- Dynamic color generation using color theory algorithms
- Predefined stock themes with consistent design tokens
- Theme-aware property references (`@swatch.*`, `@fontSize.*`, etc.)
- Extensible theme architecture for custom themes

For detailed theme documentation, see [packages/core/themes/README.md](./themes/README.md).

### Compute System

Property computation engine that resolves design values through inheritance and mathematical calculations. Provides computation functions for dynamic value calculation.

**Current Functions**: AUTO_FIT, HIGH_CONTRAST_COLOR, OPTICAL_PADDING, MATCH

For detailed compute system documentation, see [packages/core/compute/README.md](./compute/README.md).

## Property System Details

### Compound Properties

Properties with multiple sub-properties:

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

The override system handles property inheritance and modification through two distinct mechanisms:

#### Schema Overrides

Property overrides defined in component schemas. These are part of the component definition and specify default property values for child components.

#### Nested Overrides (Runtime)

Parent components can modify child component properties during node instantiation. These are applied at runtime when components are created from schemas and **become regular overrides** on the child component once instantiated.

#### Nested Override Example

A BAR_BUTTONS component can customize individual buttons:

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

The system converts nested object syntax to flattened dot notation:

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

## Workspace State Management

The workspace state management system coordinates all systems, ensuring changes are applied consistently and relationships are maintained.

### Dual Reducer System

The system operates with two distinct reducer systems:

#### Core Reducer

Handles direct user interactions—immediate, precise, and predictable.

#### AI Reducer

Handles AI-generated actions—batch processing with intelligent reconciliation.

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

The mutation system controls how changes are applied throughout the workspace, creating propagation patterns that maintain consistency while respecting the hierarchical nature of the design system.

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

#### 2. Default Variant

System-generated from schemas and represent the canonical form:

- **Creation**: Not allowed - only system can create default variants
- **Deletion**: Not allowed - default variants are protected
- **Property Setting**: Allowed with no propagation - can be customized
- **Theme Setting**: Allowed with downstream propagation - themes affect instances
- **Renaming**: Not allowed - default variant names are system-managed
- **Reordering**: Not allowed - default variants maintain their position

#### 3. User Variant

Custom creations that extend or modify the default behavior:

- **Creation**: Allowed - users can create custom variants
- **Deletion**: Allowed with downstream propagation - affects all instances
- **Property Setting**: Allowed with no propagation - properties are overrides
- **Theme Setting**: Allowed with downstream propagation - themes affect instances
- **Renaming**: Allowed with downstream propagation - name changes affect instances
- **Reordering**: Allowed - variants can be reordered within boards

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

The propagation system determines how changes flow through the workspace hierarchy.

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

Used for property overrides where each component maintains its own properties independently.

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

Ensures that when a variant's theme changes, all instances of that variant inherit the new theme.

### Component Level Hierarchy

The mutation system enforces component hierarchy constraints, ensuring that components can only contain appropriate child components:

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

This ensures that:

- Primitives cannot contain other components
- Elements can contain primitives, other elements, and frames
- Parts can contain primitives, elements, other parts, and frames
- Modules can contain primitives, elements, parts, other modules, and frames
- Screens can contain everything
- Frames can contain everything except screens

## Type Safety System

The Seldon Core Engine is built with type safety throughout. Every property, value, and relationship is typed and validated.

### Property Keys

All property keys are strongly typed, ensuring that only valid properties can be set on components.

### Property Paths

Property paths support dot notation for compound properties, allowing navigation of complex property hierarchies with type safety.

### Value Types

Every value has a type that carries semantic meaning. A color value is a `ColorValue` that could be a theme reference, an exact color, or a computed value.

## Integration Points

The Seldon Core Engine integrates with the broader Seldon ecosystem:

### Factory System Integration

The core engine integrates with the factory system to transform workspaces into production-ready code. The compute system ensures that all computed values are resolved before CSS generation and component creation.

### Component System Integration

The core engine provides the foundation for the component system, defining the schemas, properties, and relationships that components use.

### AI System Integration

The core engine includes AI integration, with reference-based targeting, schema-workspace reconciliation, and variant creation.

## Usage

To use the core types and utilities in your project:

1. Add `"@seldon/core": "workspace:*"` to your dependencies in package.json
2. Run `bun install`
3. Import the types you need from the package

```typescript
import { Component, Instance, Variant, Workspace } from "@seldon/core"
```

### Type Definitions

The examples in this document use the following types:

```typescript
import { ComponentId } from "@seldon/core/components/constants"
import { BackgroundPosition } from "@seldon/core/properties/constants/background-positions"
import { BorderStyle } from "@seldon/core/properties/constants/border-styles"
import { ComputedFunction } from "@seldon/core/properties/constants/computed-functions"
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

## Usage as Source of Truth

This README serves as the authoritative documentation for the Seldon Core Engine. When making changes to the core functionality:

1. **Update this README first** to reflect the intended core behavior and architecture
2. **Implement changes** to match the documented specifications and subsystem integration
3. **Update subsystem documentation** to maintain consistency across all core components
4. **Validate that the core engine** follows the documented architecture and integration patterns
5. **Ensure all subsystems** work together as documented in the integration points

The core engine is designed to be:

- **Central Hub**: Serves as the foundation for all design system operations
- **Type-Safe**: Full TypeScript support with documented interfaces and type definitions
- **Integrated**: Seamless integration between all subsystems (workspace, properties, themes, compute)
- **Extensible**: Easy to add new functionality following documented patterns
- **Predictable**: System behavior should match documentation exactly
- **Validated**: Comprehensive validation and error handling throughout
- **Consistent**: All subsystems follow the documented architectural principles

### Core Development Workflow

When creating or modifying core functionality:

1. **Define Architecture**: Document the system's role in the overall design system
2. **Update Subsystems**: Ensure all affected subsystems are updated accordingly
3. **Implement Integration**: Follow documented integration patterns between subsystems
4. **Test Integration**: Verify all subsystems work together as documented
5. **Update Documentation**: Keep this README and all subsystem READMEs current

### Core System Validation

All core functionality must validate against documented specifications:

- **Subsystem Integration**: Must follow documented integration patterns
- **Type Safety**: Must maintain documented TypeScript interfaces and type definitions
- **Architecture Compliance**: Must follow documented architectural principles
- **Error Handling**: Must implement documented error handling and recovery patterns

This ensures consistency across the entire core system and maintains the reliability of the design system architecture.

For detailed implementation information, see the specific subsystem documentation:

- [Properties README](./properties/README.md) - Property system and value types
- [Themes README](./themes/README.md) - Theme system and design tokens
- [Compute README](./compute/README.md) - Property computation and inheritance
- [Workspace README](./workspace/README.md) - Workspace state management and component processing
- [Helpers README](./helpers/README.md) - Utility functions and helpers
- [Rules README](./rules/README.md) - Rules configuration and authorization
- [Components README](../components/README.md) - Component system and schemas
- [Factory README](../factory/README.md) - Code generation and export systems
