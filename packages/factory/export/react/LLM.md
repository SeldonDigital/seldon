# React Export System - LLM Reference

## Quick Start for LLMs

**Core Purpose**: Transforms valid Seldon workspaces into production-ready React components with TypeScript support, handling complex component hierarchies, prop inheritance, and optimized JSX structures.

**Key Features**:
- **Workspace Processing**: Converts computed workspaces into React components
- **Standard vs Inline Components**: Automatic rendering strategy based on prop validation
- **Style Override Processing**: Sophisticated CSS class merging and cascade optimization
- **Type Safety**: Full TypeScript interfaces with proper HTML element typing
- **Tree Shaking**: Optimized imports with only used components and icons

## Export Workflow (CRITICAL)

The system follows a sequential pipeline that processes workspace data into exportable React components:

1. **Workspace Computation** - Resolves all properties and inheritance chains
2. **Component Discovery** - Identifies exportable variants and builds component trees
3. **Validation** - Validates component props against schemas
4. **Code Generation** - Creates TypeScript interfaces, React components, and imports
5. **Asset Processing** - Handles images, icons, fonts, and other assets
6. **File Assembly** - Combines all generated content into exportable files

## Component Processing Strategy

### Standard vs Inline Component Processing

The validation results determine how components are processed and exported:

**Standard Components (Valid Props):**
- All children match the component schema
- Component is imported and used as a standard React component
- Generated as: `<ComponentName {...props} />`
- Full TypeScript interface support
- Tree-shaken imports

**Inline Components (Invalid Props):**
- Children contain extra props not in the schema
- Component is rendered inline with its children expanded
- Generated as: `<Frame {...props}><Child1 {...child1Props} /><Child2 {...child2Props} /></Frame>`
- Only child component interfaces are imported
- Parent component interface is not imported (since it's not used)

**Processing Logic:**
```typescript
if (childValidation.invalidProps.length > 0) {
  // Render as inline component with expanded children
  return generateInlineComponent(node, component, propsName, nodeIdToClass, propNamesMap, childValidation)
} else {
  // Render as standard component import
  return generateNormalComponentWithValidProps(node, component, propsName, nodeIdToClass, propNamesMap, childValidation)
}
```

## Style Override Processing

The system processes style overrides through multiple layers:

### 1. CSS Class Generation and Ordering
- Base component classes are generated first (e.g., `sdn-button`)
- Variant classes follow with proper depth-based ordering
- Shallower nodes override deeper ones via CSS cascade
- Classes are sorted alphabetically within the same depth level

### 2. Class Name Merging in Components
```typescript
// Frame className merging
const frameClassName = combineClassNames("button-bar-frame", className)

// Child prop className merging  
const buttonProps = { 
  ...sdn.button, 
  ...button, 
  className: combineClassNames(sdn.button?.className, button?.className) 
}
```

### 3. Class Deduplication
- The `combineClassNames` utility removes duplicate classes
- Preserves order while eliminating redundancy
- Handles undefined and empty values gracefully

## Component Generation Pipeline

### Main Export Function
```typescript
export async function exportReact(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]>
```

**Process Flow:**
1. **Workspace Computation**: Resolves all properties and inheritance chains
2. **Style Registry**: Builds CSS class mappings from workspace with proper override hierarchy
3. **Component Discovery**: Identifies components to export from variants
4. **Icon Collection**: Gathers used icons for tree shaking
5. **Stylesheet Generation**: Creates CSS file with optimized class ordering and cascade
6. **Image Processing**: Handles image assets and path transformation
7. **Component Generation**: Creates each component file with full TypeScript support and class merging
8. **Supporting Files**: Generates primitives, icons, fonts, utilities, and README
9. **License Addition**: Adds license headers to all generated files

### Component File Generation

For each component, the system generates a complete file through these steps:

```typescript
// 1. Interface generation
source = insertInterface(source, component)

// 2. Component function generation  
source = insertComponentFunction(source, component, nodeIdToClass)

// 3. Default props generation
source = insertDefaultProps(source, component, nodeIdToClass)

// 4. Import management
source = insertImports(source, component)

// 5. Special handling (icon maps, etc.)
if (component.config.react.returns === "iconMap") {
  source = insertIconMap(source, usedIconIds)
}

// 6. Code formatting
source = await format(source)
```

## Data Structures

### ComponentToExport
```typescript
type ComponentToExport = {
  name: string                    // Component name (e.g., "ButtonBar")
  componentId: ComponentId        // Internal component identifier
  variantId: VariantId           // Specific variant being exported
  defaultVariantId: VariantId    // Default variant for fallbacks
  config: ComponentExport        // Export configuration
  output: { path: string }       // Output file path
  tree: JSONTreeNode            // Component hierarchy tree
}
```

### JSONTreeNode
```typescript
type JSONTreeNode = {
  name: string                    // Component name
  nodeId: InstanceId | VariantId  // Unique node identifier
  level: ComponentLevel          // Component level (primitive, element, part, module)
  dataBinding: DataBinding       // Props and interface information
  children?: JSONTreeNode[]      // Child components
  classNames?: string[]          // Associated CSS classes
}
```

### ComponentPropsValidation
```typescript
interface ComponentPropsValidation {
  validProps: JSONTreeNode[]           // Props that match the component schema
  invalidProps: JSONTreeNode[]         // Extra props not in the schema
  componentHasFewerPropsThanSchema: boolean  // Whether component is missing expected props
}
```

## Key Utility Functions

### Class Name Utilities
```typescript
// Merge default and custom class names
export function combineClassNames(
  defaultClassName?: string,
  customClassName?: string,
): string

// Get variant class names for a component
export function getVariantClassNames(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string

// Normalize class names by removing duplicates
export function normalizeClassNames(classNames?: string[]): string
```

### Component Generation Functions
```typescript
// Generate TypeScript interface
export function insertInterface(source: string, component: ComponentToExport)

// Generate React component function
export function insertComponentFunction(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
)

// Generate default props
export function insertDefaultProps(
  source: string,
  component: ComponentToExport,
  nodeIdToClass?: Record<string, string>,
)

// Manage imports with tree shaking
export function insertImports(source: string, component: ComponentToExport): string
```

## Rendering Strategies

### Standard Component Rendering (Valid Props)
```jsx
// Component matches schema - imported and used normally
<Button {...buttonProps} />
```

### Conditional Rendering (Missing Props)
```jsx
// Component missing expected props - rendered conditionally
{button && (
  <Button {...buttonProps} />
)}
```

### Inline Component Rendering (Invalid Props)
```jsx
// Component has extra props not in schema - rendered inline with children expanded
<Frame {...buttonProps}>
  <Icon {...iconProps} />
  <Label {...labelProps} />
</Frame>
```

## Generated Component Example

**Input**: ButtonBar component with two buttons and an icon

**Generated Output**:
```typescript
import { HTMLAttributes } from "react"
import { combineClassNames } from "../utils/class-name"
import { Button } from "../elements/Button"
import { Icon } from "../primitives/Icon"
import { ButtonProps } from "../elements/Button"
import { IconProps } from "../primitives/Icon"

export interface ButtonBarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  button?: ButtonProps
  button2?: ButtonProps
  icon?: "arrow-right" | "arrow-left" | "__default__"
}

/**
 * ButtonBar component with two buttons and an icon
 */
export function ButtonBar({
  className = "",
  button = sdn.button,
  button2 = sdn.button2,
  icon = "arrow-right",
  ...props
}: ButtonBarProps) {
  const frameClassName = combineClassNames("button-bar-frame", className)
  const buttonProps = { ...sdn.button, ...button, className: combineClassNames(sdn.button?.className, button?.className) }
  const button2Props = { ...sdn.button2, ...button2, className: combineClassNames(sdn.button2?.className, button2?.className) }
  const iconProps = { ...sdn.icon, ...icon, className: combineClassNames(sdn.icon?.className, icon?.className) }

  return (
    <div className={frameClassName} {...props}>
        <Button {...buttonProps} />
        <Button {...button2Props} />
        <Icon {...iconProps} />
    </div>
  )
}

const sdn: ButtonBarProps = {
  button: {
    label: {
      children: "Primary"
    },
    icon: {
      icon: "__default__"
    }
  },
  button2: {
    label: {
      children: "Secondary"
    }
  },
  icon: {
    icon: "arrow-right"
  }
}
```

## Export Requirements

**Input Requirements:**
- Valid Seldon workspace with computed properties
- Export options specifying target framework and output paths
- Component variants must be properly configured in workspace

**Generated Output:**
- TypeScript interfaces for all components
- Optimized JSX structures with proper prop inheritance
- CSS class integration and stylesheet generation
- Tree-shaken imports and asset processing
- Production-ready React components

## LLM Guidelines

### ✅ DO
- Understand the workspace computation step before export
- Validate component props against schemas
- Use proper standard vs inline component processing
- Handle style overrides through class merging
- Generate proper TypeScript interfaces extending HTML element types
- Use tree shaking for imports and icons
- Apply proper CSS cascade ordering
- Handle prop inheritance and merging correctly
- Use the `combineClassNames` utility for class merging
- Generate proper default props with fallback values
- Format generated code with Prettier
- Handle special cases like icon maps and dynamic HTML elements

### ❌ DON'T
- Skip workspace computation before export
- Ignore prop validation results
- Mix standard and inline component rendering incorrectly
- Mutate workspace objects directly
- Skip CSS class deduplication
- Generate invalid TypeScript interfaces
- Import unused components or icons
- Ignore CSS cascade ordering
- Skip prop inheritance processing
- Hardcode class names without merging
- Skip default prop generation
- Generate unformatted code
- Ignore special component configurations

## Common Patterns

**Component Discovery**:
```typescript
const componentsToExport = getComponentsToExport(
  workspace,
  options,
  nodeIdToClass,
)
```

**Prop Validation**:
```typescript
const validation = validateComponentProps(
  componentName,
  componentId,
  children,
)
```

**Class Name Merging**:
```typescript
const mergedClassName = combineClassNames(
  defaultClassName,
  customClassName
)
```

**Component Generation**:
```typescript
source = insertInterface(source, component)
source = insertComponentFunction(source, component, nodeIdToClass)
source = insertDefaultProps(source, component, nodeIdToClass)
source = insertImports(source, component)
source = await format(source)
```

## Quick Reference

**Core Imports**:
```typescript
import { exportReact } from '@seldon/factory/export/react'
import { ComponentToExport, JSONTreeNode, ComponentPropsValidation } from '@seldon/factory/export/types'
import { combineClassNames, getVariantClassNames } from './utils/class-name'
import { validateComponentProps } from './validation/validate-component-props'
```

**Common Patterns**:
- Standard components: `<ComponentName {...props} />`
- Inline components: `<Frame {...props}><Child {...childProps} /></Frame>`
- Class merging: `combineClassNames(default, custom)`
- Prop validation: `validateComponentProps(name, id, children)`
- Interface generation: `insertInterface(source, component)`
