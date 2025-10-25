# Seldon Components Technical Reference

## Quick Start

### For Engineers
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

### For Designers
- **5 Component Levels**: Screen → Module → Part → Element → Primitive (plus Frame as special container)
- **Theme Integration**: Use `@swatch.primary`, `@fontSize.large` for consistent styling
- **Property Inheritance**: Child components automatically inherit parent styling
- **Flexible Nesting**: Components can only contain equal or lower-level components

## Hierarchy Enforcement

The system enforces strict nesting rules:

- **PRIMITIVE**: Cannot contain any children
- **ELEMENT**: Can contain PRIMITIVE, ELEMENT, FRAME
- **PART**: Can contain PRIMITIVE, ELEMENT, PART, FRAME  
- **MODULE**: Can contain PRIMITIVE, ELEMENT, PART, MODULE, FRAME
- **SCREEN**: Can contain any component type
- **FRAME**: Can contain any component type (special container, not a hierarchy level)

### Nesting Examples

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

## Component Schemas

Each component is defined by a ComponentSchema that specifies:

- **Identity**: `id`, `name`, `intent`, `icon`
- **Classification**: `level`, `tags`, `restrictions`
- **Properties**: All available properties with types and defaults
- **Children**: Optional child components with configurations
- **Constraints**: Rules for adding/reordering children

### Flexible Component Design

Components should be designed to be flexible and reusable across different contexts. The key is creating schemas that provide customization points through children, overrides, and nestedOverrides.

#### Example: Flexible Button Component

A Button schema should accommodate various use cases:

```typescript
// Button schema with flexible children and overrides
export const ButtonSchema = {
  level: ComponentLevel.ELEMENT,
  children: [
    {
      component: Seldon.ComponentId.ICON,
      overrides: {
        // Default icon can be overridden by parent
        symbol: { type: ValueType.PRESET, value: "__default__" },
        // Icon size adapts to button size
        size: { type: ValueType.COMPUTED, value: { 
          function: "AUTO_FIT", 
          input: { basedOn: "#parent.buttonSize", factor: 0.8 } 
        }}
      }
    },
    {
      component: Seldon.ComponentId.LABEL,
      overrides: {
        // Default text can be customized
        content: { type: ValueType.EXACT, value: "Button" }
      }
    }
  ],
  properties: {
    // Button-specific properties that parents can override
    buttonSize: { type: ValueType.THEME_ORDINAL, value: "@size.medium" },
    variant: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
  }
}
```

#### Parent Component Usage

When used in different contexts, the Button can be customized:

```typescript
// In a Card component
{
  component: Seldon.ComponentId.CARD_HORIZONTAL,
  children: [
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
        // Override button properties for card context
        buttonSize: { type: ValueType.THEME_ORDINAL, value: "@size.small" },
        variant: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.secondary" }
      },
      nestedOverrides: {
        // Customize the button's icon for this specific use
        icon: {
          symbol: { type: ValueType.PRESET, value: "heart" }
        },
        // Customize the button's label
        label: {
          content: { type: ValueType.EXACT, value: "Save" }
        }
      }
    }
  ]
}

// In a Navigation component
{
  component: Seldon.ComponentId.NAV,
  children: [
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
        // Different styling for navigation context
        buttonSize: { type: ValueType.THEME_ORDINAL, value: "@size.large" },
        variant: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.neutral" }
      },
      nestedOverrides: {
        icon: {
          symbol: { type: ValueType.PRESET, value: "home" }
        },
        label: {
          content: { type: ValueType.EXACT, value: "Home" }
        }
      }
    }
  ]
}
```

#### Design Principles

1. **Provide Sensible Defaults**: Every child and property should have a reasonable default value
2. **Enable Contextual Customization**: Use overrides for component-level changes and nestedOverrides for child-specific changes
3. **Maintain Flexibility**: Allow parents to customize both the component itself and its children
4. **Use Computed Properties**: Use computed values for responsive behavior and proportional relationships

### Children and Nesting

Components can contain child components based on hierarchy rules:

```typescript
children: [
  {
    component: Seldon.ComponentId.ICON,
    overrides: {
      symbol: { type: ValueType.PRESET, value: "__default__" },
      size: { type: ValueType.COMPUTED, value: { function: "AUTO_FIT", input: { basedOn: "#parent.buttonSize", factor: 0.8 } } }
    }
  },
  {
    component: Seldon.ComponentId.LABEL,
    overrides: {
      content: { type: ValueType.EXACT, value: "Button" }
    }
  }
]
```

### Restrictions

Components can control certain child behavior through restrictions:

```typescript
restrictions: {
  addChildren: false,      // Prevents adding new children
  reorderChildren: true    // Allows reordering existing children
}
```

### Component Instance Structure

Component instances can override schema defaults:

```typescript
interface Component {
  component: ComponentId              // Which schema to use
  properties?: Properties             // Instance-specific properties
  overrides?: Properties              // Property overrides for children
  nestedOverrides?: NestedOverrides   // Child property overrides
  children?: Component[]              // Child components to use
}
```

### Overrides and NestedOverrides

Components support two types of property overrides for child components:

**Overrides**: Direct property overrides defined in component schemas
```typescript
children: [{
  component: Seldon.ComponentId.ICON,
  overrides: {
    symbol: { type: ValueType.PRESET, value: "material-add" },
    size: { type: ValueType.COMPUTED, value: { function: "AUTO_FIT", input: { basedOn: "#parent.buttonSize", factor: 0.8 } } }
  }
}]
```

**NestedOverrides**: Parent-controlled child property overrides applied at runtime
```typescript
nestedOverrides: {
  icon: { symbol: "material-add" },
  label: { content: "Custom Text" }
}
```

**Key Differences:**
- **Overrides**: Defined in schemas, use full property structure with types
- **NestedOverrides**: Applied at runtime, use simplified value syntax
- **Overrides**: Applied during component instantiation
- **NestedOverrides**: Applied during property processing pipeline

## NestedOverrides System

### What is NestedOverrides?

NestedOverrides properties allow parent components to override properties on grandchildren components, enabling:

- **Direct property control** - Parents can override any property on child components
- **Theme propagation** - Theme values can be passed down with automatic type detection
- **Nested property support** - Complex nested properties can be overridden using dot notation
- **Type safety** - The system automatically detects and assigns appropriate value types

### Type-Safe NestedOverrides

NestedOverrides is fully type-safe with the following value types:

```typescript
type NestedOverridesValue = 
  | string                    // Simple strings, theme values (@fontSize.large), icon IDs
  | number                    // Simple numbers
  | boolean                   // Simple booleans
  | { unit: string; value: number }  // Complex values with units (e.g., { unit: "rem", value: 2 })
  | NestedOverridesObject            // Nested objects for nested property overrides

type NestedOverridesObject = {
  [key: string]: NestedOverridesValue
}

type NestedOverrides = {
  [componentId: string]: NestedOverridesObject
}
```

This provides compile-time type checking for all nestedOverrides values.

### How NestedOverrides Works

NestedOverrides works through a secure override mechanism with property validation:

1. **Parent → Child**: Parent component passes values to child components via `nestedOverrides`
2. **Property Validation**: Only properties declared in the child component's schema can be overridden
3. **Automatic Override**: Valid child component properties are automatically overridden with NestedOverrides values
4. **Type Detection**: Theme values are automatically detected and assigned appropriate types
5. **Security**: Properties not present in the child schema are silently ignored

```typescript
// Parent component passes values to child
nestedOverrides: {
  title: {
    content: "Custom Title",           // ✅ Overrides title's content property
    fontSize: "@fontSize.large",       // ✅ Overrides title's fontSize with theme value
    color: "@swatch.primary"           // ✅ Overrides title's color with theme value
  },
  // title.textAlign would be ignored - textAlign not declared in child schema
}
```

**How It Works:**
1. Parent passes values via `nestedOverrides` using nested object structure
2. System validates that each property exists in the child component's schema
3. Only valid properties are overridden during instantiation
4. Theme values are detected and assigned appropriate types (THEME_ORDINAL, THEME_CATEGORICAL, etc.)
5. Complex values (objects with unit/value) are preserved as-is
6. Invalid properties are silently ignored for security

### NestedOverrides Implementation

```typescript
// Children receive these values during instantiation
const processedProperties = processNestedOverridesProps(
  childProperties,     // Properties from child component schema
  parentNestedOverrides,      // NestedOverrides data from parent component
  componentId          // ID of the child component being processed
)
```

**Processing Steps:**
1. **Index Resolution**: Numbered references (`tableData2`) are mapped to specific child indices
2. **Property Validation**: Each property is checked against the child component's schema
3. **Type Detection**: Values are analyzed and assigned appropriate types
4. **Override Application**: Valid properties are overridden with nestedOverrides values

### NestedOverrides Format

NestedOverrides uses **nested object format**:

```typescript
nestedOverrides: {
  tableData: { 
    content: "99", 
    height: { unit: "rem", value: 2 } 
  },
  tableData2: { content: "" },
  title: { 
    content: "Custom Title",
    fontSize: "@fontSize.large"
  }
}
```

**Supported Value Types:**
- **Simple values**: `"Custom Title"`, `42`, `true`
- **Theme values**: `"@fontSize.large"` (auto-detected as THEME_ORDINAL)
- **Complex values**: `{ unit: "rem", value: 2 }` (preserved as-is)
- **Icon IDs**: `"material-add"` (auto-detected as PRESET)

**Property Paths:**
```typescript
nestedOverrides: {
  title: {
    content: "Custom Title",     // Overrides the content property
    fontSize: "@fontSize.large"  // Overrides the fontSize property
  },
  button: {
    color: "@swatch.primary"     // Overrides the color property
  },
  icon: {
    symbol: "material-add"       // Overrides the symbol property
  }
}
```

**Nested Properties:**
```typescript
nestedOverrides: {
  title: {
    font: {
      size: "@fontSize.large"    // Overrides nested font.size property
    }
  },
  button: {
    border: {
      width: { unit: "px", value: 2 }  // Overrides nested border.width property
    }
  }
}
```

### Security and Property Validation

NestedOverrides includes built-in security to prevent unauthorized property overrides:

**✅ Allowed Overrides:**
```typescript
// Child schema declares these properties
children: [{
  component: "title",
  properties: {
    content: { type: "EXACT", value: "Default" },
    fontSize: { type: "THEME_ORDINAL", value: "@fontSize.medium" },
    color: { type: "THEME_CATEGORICAL", value: "@swatch.black" }
  }
}]

// Parent can override these declared properties
nestedOverrides: {
  title: {
    content: "Custom Title",     // ✅ Allowed - content is declared
    fontSize: "@fontSize.large", // ✅ Allowed - fontSize is declared
    color: "@swatch.primary"     // ✅ Allowed - color is declared
  }
}
```

**❌ Blocked Overrides:**
```typescript
// Parent tries to override undeclared properties
nestedOverrides: {
  title: {
    textAlign: "center",         // ❌ Blocked - textAlign not declared
    letterSpacing: "2px",        // ❌ Blocked - letterSpacing not declared
    textCase: "uppercase"        // ❌ Blocked - textCase not declared
  }
}
// These properties are silently ignored and the original values are preserved
```

**Security Benefits:**
- **Principle of Least Privilege**: Components can only override properties they're explicitly allowed to
- **Prevents Unauthorized Access**: No accidental or malicious property overrides
- **Maintains Component Contracts**: Child components maintain control over their interface
- **Silent Failure**: Invalid overrides are ignored rather than causing errors

### Index References for Multiple Children

When a component has **multiple children of the same type**, you can use **index references** to target specific instances:

**Index Reference Format:**
```typescript
nestedOverrides: {
  tableData: { content: "99" },        // Targets the first tableData component (index 0)
  tableData2: { content: "" },         // Targets the second tableData component (index 1)
  tableData3: { content: "" },         // Targets the third tableData component (index 2)
  button1: { text: "Click Me" }        // Targets the first button component (index 0)
}
```

**How Index References Work:**
1. **Numbered naming** - Use `componentName2`, `componentName3`, etc. for specific instances
2. **Component type matching** - Only children of the specified component type are counted
3. **Automatic targeting** - The system finds the nth child of that type and applies the nestedOverrides
4. **Security maintained** - Only properties declared in the child schema can be overridden

**Example with Calendar Month:**
```typescript
export const schema = {
  name: "Calendar Month",
  ...
  children: [
    {
      component: "calendarWeek",
      nestedOverrides: {
        // Nested object format (recommended)
        tableData: { 
          content: "99", 
          height: { unit: "rem", value: 2 } 
        },
        tableData2: { content: "" },
        tableData3: { content: "" },
        tableData4: { content: "" },
        tableData5: { content: "01" },
        tableData6: { content: "02" },
        tableData7: { content: "03" },
        tableData8: { content: "04" }
      }
    }
  ]
  ...
}
```

**How This Works:**
1. **Calendar Week** gets multiple table data cells with specific content
2. **First cell** (`tableData`) gets content "99" and height 2rem
3. **Second cell** (`tableData2`) gets empty content
4. **Third cell** (`tableData3`) gets empty content
5. **Subsequent cells** get numbered content "01", "02", "03", "04"

**Key Points:**
- Index references like `tableData2`, `tableData3` target specific table data components
- Complex values like `{ unit: "rem", value: 2 }` are preserved as-is
- Only properties declared in the child schema can be overridden
- The system automatically maps numbered references to the correct child components
- This allows precise control over multiple elements of the same type

**NestedOverrides Features:**

Index References - Target specific instances when components have multiple children of the same type:
```typescript
nestedOverrides: {
  tableData: { content: "01" },    // First tableData
  tableData2: { content: "02" },   // Second tableData
  tableData3: { content: "03" },   // Third tableData
  tableData4: { content: "04" }    // Fourth tableData
}
```

Security - Only properties declared in the child component's schema can be overridden. Undeclared properties are silently ignored.

Processing - The system:
1. Validates that properties exist in child component's schema
2. Detects value types automatically
3. Applies only valid overrides, ignores invalid ones
4. Maintains type safety

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
orientation: Sdn.Orientation.HORIZONTAL
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
References to theme values that update automatically when theme changes:

**THEME_CATEGORICAL (non-sequential):**
- `@swatch.primary` - Primary color from current theme
- `@border.solid` - Border style preset
- `@shadow.soft` - Shadow effect preset
- `@font.heading` - Typography preset
- `@fontFamily.primary` - Font family reference

**THEME_ORDINAL (sequential):**
- `@fontSize.large` - Large font size from theme
- `@padding.cozy` - Cozy padding spacing
- `@margin.comfortable` - Comfortable margin spacing
- `@corners.compact` - Compact border radius
- `@borderWidth.medium` - Medium border width

### Property References (# Symbol)
References to other properties for proportional relationships:
- `#parent.buttonSize` - Parent component's buttonSize property
- `#background.color` - Component's own background color
- `#color` - Self-reference for computed relationships

## Computed Properties

Enable dynamic, proportional design through calculated values:

```typescript
size: {
  type: Sdn.ValueType.COMPUTED,
  value: {
    function: Sdn.ComputedFunction.AUTO_FIT,
    input: { basedOn: "#parent.buttonSize", factor: 0.8 }
  }
}
```

This creates a size that's automatically 80% of the parent's button size, maintaining proportional relationships when the parent changes.

## Property Processing Pipeline

Properties are resolved in this order (later stages override earlier ones):

1. Schema Properties - Default values from component schema
2. Instance Properties - Overrides when creating component instances
3. Child Overrides - Direct property overrides on child components
4. NestedOverrides - Parent-controlled child property overrides
5. Computed Resolution - Dynamic value calculation based on references

## Component Instances

Component instances represent actual, customizable components used in applications:

```typescript
interface Component {
  component: ComponentId              // Which schema to use
  properties?: Properties             // Instance-specific properties
  overrides?: Properties              // Property overrides for children
  nestedOverrides?: NestedOverrides   // Child property overrides
  children?: Component[]              // Child components
}
```

## Catalog System

Components are organized by hierarchy level:

```typescript
export const catalog: Catalog = {
  frames: [...],      // Frame components
  primitives: [...],  // Primitive components  
  elements: [...],    // Element components
  parts: [...],       // Part components
  modules: [...],     // Module components
  screens: [...]      // Screen components
}
```

## Icon System

Comprehensive icon library supporting multiple icon sets:
- Material Design icons for standard UI elements
- Social media icons for modern applications  
- Popular icon libraries (Streamline, Feather, etc.)
- Custom Seldon icons for specialized use cases

Icons are referenced using PRESET values and can be easily extended with additional icon libraries.

## Component Examples

### Primitive: Title Component
```typescript
export const schema = {
  name: "Title",
  id: Seldon.ComponentId.TITLE,
  level: Seldon.ComponentLevel.PRIMITIVE,
  properties: {
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Title"
    },
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black"
    }
  }
}
```

### Element: Button Component
```typescript
export const schema = {
  name: "Button",
  id: Seldon.ComponentId.BUTTON,
  level: Seldon.ComponentLevel.ELEMENT,
  children: [
    {
      component: Seldon.ComponentId.ICON,
      overrides: {
        size: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.AUTO_FIT,
            input: { basedOn: "#parent.buttonSize", factor: 0.8 }
          }
        }
      }
    }
  ]
}
```

### Part: Calendar Month with NestedOverrides
```typescript
export const schema = {
  name: "Month",
  id: Seldon.ComponentId.CALENDAR_MONTH,
  level: Seldon.ComponentLevel.PART,
  children: [
    {
      component: Seldon.ComponentId.CALENDAR_WEEK,
      nestedOverrides: {
        tableData: { content: "01" },
        tableData2: { content: "02" },
        tableData3: { content: "03" },
        tableData4: { content: "04" }
      }
    }
  ]
}
```

## Special Symbols and Their Meanings

### @ Symbol - Theme References

The `@` symbol indicates theme-based values from the actual component schemas:

- `@swatch.primary` - References the primary color from the theme
- `@fontSize.small` - References small font size from the theme
- `@fontSize.xsmall` - References extra small font size from the theme
- `@padding.cozy` - References cozy padding spacing from the theme

**Example from ButtonSocial Schema:**
```typescript
export const schema = {
  name: "Social Media Button",
  ...
  children: [ ... ],
  properties: {
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.small",
      restrictions: {
        allowedValues: [
          "@fontSize.xxsmall",
          "@fontSize.xsmall", 
          "@fontSize.small",
          "@fontSize.medium",
          "@fontSize.large",
          "@fontSize.xlarge",
          "@fontSize.xxlarge"
        ]
      }
    },
    background: {
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary"
      }
    }
  }
}
```

### # Symbol - Property References

The `#` symbol indicates computed property-based references from the actual component schemas:

- `#parent.buttonSize` - References the parent component's buttonSize property
- `#parent.background.color` - References the parent component's background color
- `#color` - References the component's own color property

**Example from ButtonSocial Schema:**
```typescript
export const schema = {
  name: "Social Media Button",
  ...
  children: [
    {
      component: Seldon.ComponentId.ICON,
      properties: {
        size: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.AUTO_FIT,
            input: { basedOn: "#parent.buttonSize", factor: 0.8 }
          }
        },
        color: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            input: { basedOn: "#parent.background.color" }
          }
        }
      }
    }
  ]
  ...
}
```

## Usage Examples

### Importing Components
```typescript
import { Component, Seldon, Sdn } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ValueType, ComputedFunction } from "@seldon/core/properties/constants"
```

### Basic Component with Properties

```typescript
export const schema = {
  name: "Label",
  id: Seldon.ComponentId.LABEL,
  level: Seldon.ComponentLevel.PRIMITIVE,
  properties: {
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Label"
    },
    htmlElement: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.HtmlElement.LABEL,
      restrictions: {
        allowedValues: [
          Sdn.HtmlElement.SPAN,
          Sdn.HtmlElement.LABEL
        ]
      }
    },
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FIT
    },
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black"
    },
    opacity: {
      type: Sdn.ValueType.EXACT,
      value: { value: 100, unit: Sdn.Unit.PERCENT }
    }
  }
}
```

### Component with Children and NestedOverrides

```typescript
const buttonBarComponent: Component = {
  component: "barButtons",
  properties: {
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy"
    }
  },
  children: [
    {
      component: "button",
      nestedOverrides: {
        "icon.symbol": "material-add",
        "label.content": "Add"
      }
    },
    {
      component: "button",
      nestedOverrides: {
        "icon.symbol": "material-remove", 
        "label.content": "Remove"
      }
    },
    {
      component: "button"
    }
  ]
}
```

## Best Practices

### ✅ DO
- Check component level and hierarchy position before nesting
- Respect hierarchy rules (SCREEN → MODULE → PART → ELEMENT → PRIMITIVE, with FRAME as special container)
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

This system provides a flexible way to build complex UI components while maintaining consistency through themes and inheritance.
