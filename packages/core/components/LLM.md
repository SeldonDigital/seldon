# Seldon Components - LLM Reference

## Quick Start for LLMs

**Core Purpose**: Hierarchical, schema-driven component architecture with type-safe, theme-aware UI components with property inheritance and override capabilities.

**Key Features**:

- **6-Level Hierarchy**: PRIMITIVE → ELEMENT → PART → MODULE → FRAME → SCREEN
- **Schema-Driven**: All components defined by schemas with type safety
- **NestedOverrides**: Parent components can override child properties
- **Theme Integration**: Built-in theme support with design tokens
- **Type Safety**: Full TypeScript support with compile-time validation

## Component Hierarchy (CRITICAL)

```
SCREEN → MODULE → PART → ELEMENT → PRIMITIVE
FRAME (can contain any level)
```

- **Screens**: Complete user interfaces
- **Modules**: Complex functional units
- **Parts**: Reusable UI sections
- **Elements**: Interactive components
- **Primitives**: Atomic building blocks (no children)
- **Frames**: Universal containers (can contain any level)

**Rules**: Components can only contain equal or lower-level components. Primitives cannot have children.

### Hierarchy Enforcement

- **PRIMITIVE**: Cannot contain any children
- **ELEMENT**: Can contain PRIMITIVE, ELEMENT, FRAME
- **PART**: Can contain PRIMITIVE, ELEMENT, PART, FRAME
- **MODULE**: Can contain PRIMITIVE, ELEMENT, PART, MODULE, FRAME
- **SCREEN**: Can contain any component type
- **FRAME**: Can contain any component type (special exception)

## Component Categories

| Level         | Directory     | Examples                         | Can Contain                             |
| ------------- | ------------- | -------------------------------- | --------------------------------------- |
| **PRIMITIVE** | `primitives/` | `Title`, `Text`, `Icon`, `Image` | Nothing                                 |
| **ELEMENT**   | `elements/`   | `Button`, `Avatar`, `InputText`  | PRIMITIVE, ELEMENT, FRAME               |
| **PART**      | `parts/`      | `CardHorizontal`, `ListStandard` | PRIMITIVE, ELEMENT, PART, FRAME         |
| **MODULE**    | `modules/`    | `Table`, `Calendar`, `Footer`    | PRIMITIVE, ELEMENT, PART, MODULE, FRAME |
| **SCREEN**    | `screens/`    | `Screen`                         | Any component type                      |
| **FRAME**     | `frames/`     | `Frame`                          | Any component type (special)            |

## Component Schema Structure

```typescript
interface ComponentSchema {
  id: ComponentId // Unique identifier
  name: string // Human-readable name
  intent: string // Purpose description
  icon: ComponentIcon // Visual representation
  properties: Properties // Component properties
  tags: string[] // Searchable tags
  level: ComponentLevel // Hierarchy level
  children?: Component[] // Child components (complex only)
  restrictions?: {
    // Behavior restrictions
    addChildren?: boolean
    reorderChildren?: boolean
  }
}
```

## Property System: Six Value Types

### 1. EXACT

Literal values: strings, numbers, booleans, or objects with units.

```typescript
content: "Hello World"
width: { unit: "rem", value: 2 }
```

### 2. PRESET

Predefined constants from the system library.

```typescript
orientation: Seldon.Constants.Orientation.HORIZONTAL
```

### 3. THEME_CATEGORICAL

Non-sequential theme values using `@category.*` syntax.

```typescript
color: "@swatch.primary"
border: "@border.solid"
shadow: "@shadow.soft"
font: "@font.heading"
fontFamily: "@fontFamily.primary"
```

### 4. THEME_ORDINAL

Sequential theme values using `@category.*` syntax.

```typescript
fontSize: "@fontSize.large"
padding: "@padding.cozy"
margin: "@margin.comfortable"
corners: "@corners.compact"
borderWidth: "@borderWidth.medium"
```

### 5. COMPUTED

Calculated values based on other properties using functions like `AUTO_FIT`, `HIGH_CONTRAST_COLOR`.

```typescript
size: {
  function: "AUTO_FIT",
  input: { basedOn: "#parent.buttonSize", factor: 0.8 }
}
```

### 6. EMPTY

Intentionally unset properties that use inheritance or defaults.

## Property References

### Theme References (@ Symbol)

- `@swatch.primary` - Primary color from current theme
- `@fontSize.large` - Large font size from theme
- `@padding.cozy` - Cozy padding spacing
- `@border.solid` - Border style preset
- `@shadow.soft` - Shadow effect preset

### Property References (# Symbol)

- `#parent.buttonSize` - Parent component's buttonSize property
- `#background.color` - Component's own background color
- `#color` - Self-reference for computed relationships

## NestedOverrides System

**Purpose**: Parent components can directly override properties on child components.

```typescript
type NestedOverrides = {
  [componentId: string]: NestedOverridesObject
}
```

**Usage Examples**:

```typescript
// Basic override
nestedOverrides: {
  title: {
    content: "Custom Title",
    fontSize: "@fontSize.large"
  }
}

// Multiple children (indexed)
nestedOverrides: {
  tableData: { content: "01" },      // First tableData
  tableData2: { content: "02" },     // Second tableData
  tableData3: { content: "03" }      // Third tableData
}

// Complex values
nestedOverrides: {
  tableData: {
    content: "99",
    height: { unit: "rem", value: 2 }
  }
}
```

**Security**: Only properties declared in child schemas can be overridden. Invalid properties are silently ignored.

## Component Instance Structure

```typescript
interface Component {
  component: ComponentId // Component type
  properties?: Properties // Instance properties (for this component)
  overrides?: Properties // Property overrides (for child components)
  nestedOverrides?: NestedOverrides // Child property overrides (for child components)
  children?: Component[] // Child components
}
```

**Important**: `overrides` and `nestedOverrides` are applied to child components, not to the component itself.

## Property Processing Pipeline

Properties are resolved in this order (later stages override earlier ones):

1. **Schema Properties** - Default values from component schema
2. **Instance Properties** - Overrides when creating component instances
3. **Child Overrides** - Direct property overrides on child components
4. **NestedOverrides** - Parent-controlled child property overrides
5. **Computed Resolution** - Dynamic value calculation based on references

## Special Features

**Platform Integration**: Native React components (`HTMLButton`, `HTMLDiv`, `HTMLSpan`, etc.)
**Icon System**: Comprehensive icon library supporting multiple icon sets (Material Design, Social media, Popular icon libraries, Custom Seldon icons)
**Export Configuration**: Each component defines React export behavior

## LLM Guidelines

### ✅ DO

- Check component level and hierarchy position before nesting
- Respect hierarchy rules (PRIMITIVE → ELEMENT → PART → MODULE → FRAME → SCREEN)
- Use NestedOverrides for child customization
- Leverage theme references (`@swatch.*`, `@fontSize.*`, `@padding.*`)
- Use only valid property types and respect restrictions
- Use computed properties for responsive behavior

### ❌ DON'T

- Put children in PRIMITIVE components
- Override undeclared properties in NestedOverrides
- Use invalid computed property references
- Ignore component restrictions
- Use invalid property types

## Common Patterns

**Proper Component Structure**:

```typescript
{
  component: Seldon.Constants.ComponentId.BUTTON,
  children: [
    {
      component: Seldon.Constants.ComponentId.ICON,
      overrides: {
        symbol: { type: ValueType.PRESET, value: "__default__" },
        size: { type: ValueType.COMPUTED, value: { function: "AUTO_FIT", input: { basedOn: "#parent.buttonSize", factor: 0.8 } } }
      }
    }
  ]
}
```

**Effective NestedOverrides**:

```typescript
nestedOverrides: {
  title: {
    content: "Custom Title",     // content is declared
    fontSize: "@fontSize.large"  // fontSize is declared
  }
}
```

## Integration Points

**Core Dependencies**: `@seldon/core` - Property system, themes, constants and components

**Key Imports**:

```typescript
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { Component, ComponentSchema } from "@seldon/core/components/types"
```

## Quick Reference

**Component Levels**: PRIMITIVE → ELEMENT → PART → MODULE → FRAME → SCREEN
**Property Types**: `EXACT`, `PRESET`, `THEME_CATEGORICAL`, `THEME_ORDINAL`, `COMPUTED`, `EMPTY`
**Theme References**: `@swatch.primary`, `@fontSize.large`, `@padding.cozy`
**Property References**: `#parent.buttonSize`, `#color`
