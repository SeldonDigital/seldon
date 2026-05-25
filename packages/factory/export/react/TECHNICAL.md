# Factory React Export System - Technical Reference

This document provides comprehensive code examples and implementation details for the Factory React Export System.

## Component Discovery

### Component Identification

```typescript
import { getComponentsToExport } from './discovery/get-components-to-export'

export function getComponentsToExport(
  workspace: Workspace,
  options: ExportOptions,
  nodeIdToClass: NodeIdToClass,
): ComponentToExport[]
```

**Process:**
- Filters workspace variants (excludes frames and child instances)
- Maps each variant to a `ComponentToExport` object
- Determines output paths based on component level (primitives, elements, parts, modules)
- Creates JSON tree representation for each component
- Associates export configuration for each component type

**Output Structure:**
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

### Tree Building

```typescript
import { getJsonTreeFromChildren } from './discovery/get-json-tree-from-children'

export function getJsonTreeFromChildren(
  variant: Variant,
  workspace: Workspace,
  nodeIdToClass: Record<string, string>,
): JSONTreeNode
```

**Key Features:**
- **Hierarchical Structure**: Maintains parent-child relationships
- **Property Mapping**: Maps design properties to React props
- **Reference Management**: Handles duplicate component names with numbering
- **Display Filtering**: Excludes hidden components (`display: exclude`)
- **CSS Class Integration**: Associates CSS classes with component nodes

**Tree Structure:**
```typescript
type JSONTreeNode = {
  name: string                    // Component name
  nodeId: InstanceId | VariantId  // Unique node identifier
  level: ComponentLevel          // Component level (primitive, element, part, module)
  dataBinding: DataBinding       // Props and interface information
  children?: JSONTreeNode[]      // Child components
  classNames?: string[]          // Associated CSS classes
}

type DataBinding = {
  interfaceName: string          // TypeScript interface name
  referenceName?: string         // Unique reference for duplicates
  path: string                  // Prop path (e.g., "button.icon")
  props: Record<string, {       // Prop definitions
    defaultValue: string | CSSProperties
    options?: string[]
  }>
}
```

### Data Extraction Functions

```typescript
// Component name extraction
import { getComponentName } from './discovery/get-component-name'

// Human-readable prop names
import { getHumanReadablePropName } from './discovery/get-human-readable-prop-name'

// Icon component names
import { getIconComponentName } from './discovery/get-icon-component-name'

// Node origin chain
import { getNodeOriginChain } from './discovery/get-node-origin-chain'

// Simple prop names
import { getSimplePropName } from './discovery/get-simple-prop-name'

// Used icon IDs for tree shaking
import { getUsedIconIds } from './discovery/get-used-icon-ids'
```

## Validation

### Component Prop Validation

```typescript
import { validateComponentProps } from './validation/validate-component-props'

export function validateComponentProps(
  componentName: string,
  componentId: ComponentId,
  children: JSONTreeNode[],
): ComponentPropsValidation
```

**Validation Process:**
- Compares proposed children against component schema
- Separates valid props (matching schema) from invalid props (extra props)
- Determines if component uses fewer props than specified in schema
- Maps component names to ComponentIds for validation

**Validation Results:**
```typescript
interface ComponentPropsValidation {
  validProps: JSONTreeNode[]           // Props that match the component schema
  invalidProps: JSONTreeNode[]         // Extra props not in the schema
  componentHasFewerPropsThanSchema: boolean  // Whether component is missing expected props
}
```

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

## Code Generation

### Interface Generation

```typescript
import { insertInterface } from './generation/insert-interface'

export function insertInterface(source: string, component: ComponentToExport)
```

**Process:**
- Determines base HTML element type from component configuration
- Generates own props from component properties
- Adds children props for nested components
- Creates union types for props with multiple options
- Extends appropriate HTML attributes interface

**Generated Interface Example:**
```typescript
export interface ButtonBarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  button?: ButtonProps
  button2?: ButtonProps
  icon?: "arrow-right" | "arrow-left" | "__default__"
  htmlElement?: "div" | "section" | "article"
}
```

### Component Function Generation

```typescript
import { insertComponentFunction } from './generation/insert-component-function'

export function insertComponentFunction(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
)
```

**Generation Process:**
1. **Prop Names Mapping**: Creates consistent prop names across interface and JSX
2. **Variable Declarations**: Generates prop variable declarations with class merging
3. **Return Statement**: Creates appropriate return statement based on component type
4. **JSDoc Comments**: Adds documentation for the component

**Component Types:**
- **Regular Component**: Components with valid props matching the schema (single or multiple children)
- **Custom Component**: Components with invalid props (extra props not in schema)
- **Inline Component**: Components with invalid child props, wrapped in a Frame
- **Regular Inline Component**: Components with all valid child props that have grandchildren. Only used when grandchildren are present and a Frame wrapper is needed (unlike Inline Component which wraps invalid props in a Frame)
- **HTML Element Components**: Dynamic HTML element rendering
- **Icon Map Components**: Icon mapping functionality
- **Frame Components**: Layout container components

### JSX Structure Generation

The JSX generation uses a preprocess pipeline that generates structured JSX representation with correct prop names from the start.

**JSX Structure Generation** (`generation/preprocess/generate-jsx-structure.ts`):
```typescript
import { generateJSXStructure } from './generation/preprocess/generate-jsx-structure'

export function generateJSXStructure(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): JSXNode
```

**JSX Structure to String** (`generation/preprocess/jsx-structure-to-string.ts`):
```typescript
import { jsxStructureToString } from './generation/preprocess/jsx-structure-to-string'

export function jsxStructureToString(
  jsxRoot: JSXNode,
  component: ComponentToExport,
  classNameVarName: string,
  propKeysMap: Map<string, string>,
): string
```

**Prop Extraction** (`generation/preprocess/extract-prop-names-from-jsx.ts`):
```typescript
import { extractPropValuesFromJSX, extractPropKeysFromJSX } from './generation/preprocess/extract-prop-names-from-jsx'

export function extractPropValuesFromJSX(
  jsxRoot: JSXNode,
  component: ComponentToExport,
): Map<string, string>

export function extractPropKeysFromJSX(
  jsxRoot: JSXNode,
  component: ComponentToExport,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): Map<string, string>
```

**Generated JSX Examples:**

**Regular Component (Single Child):**
```jsx
return <div className={frameClassName} {...props}>
    <Button {...buttonProps} />
</div>
```

**Regular Component (Multiple Children):**
```jsx
return (
    <div className={frameClassName} {...props}>
        <Button {...buttonProps} />
        <Icon {...iconProps} />
    </div>
)
```

**Custom Component (Invalid Props):**
```jsx
return (
    <div className={frameClassName} {...props}>
        {button && (
            <Button {...buttonProps} />
        )}
    </div>
)
```

**Inline Component (Invalid Child Props):**
```jsx
return (
    <div className={frameClassName} {...props}>
        <Frame {...buttonProps}>
            <Icon {...iconProps} />
            <Label {...labelProps} />
        </Frame>
    </div>
)
```

**Regular Inline Component (Valid Child Props with Grandchildren):**
Only used when grandchildren are present and a Frame wrapper is needed.
```jsx
return (
    <div className={frameClassName} {...props}>
        <Button {...buttonProps} icon={icon1Props} />
        <Button {...button2Props} icon={icon2Props} />
    </div>
)
```

### Return Statement Generation

```typescript
import { 
  generateIconMapReturn,
  generateHtmlElementReturn,
  generateSimpleReturn 
} from './generation/generate-react-component-return-statements'

export function generateIconMapReturn(component: ComponentToExport, nodeIdToClass: NodeIdToClass): string
export function generateHtmlElementReturn(component: ComponentToExport, nodeIdToClass: NodeIdToClass): string
export function generateSimpleReturn(component: ComponentToExport, nodeIdToClass: NodeIdToClass): string
```

**Return Types:**
- **Icon Map Returns**: Dynamic icon rendering with fallback handling
- **HTML Element Returns**: Switch statements for dynamic HTML element rendering
- **Simple Returns**: Direct component returns for basic components

### Interface Base Generation

```typescript
import { 
  getGenericAndParameters,
  generateOwnPropsContent 
} from './generation/generate-typescript-interface-base'

export function getGenericAndParameters(component: ComponentToExport)
export function generateOwnPropsContent(component: ComponentToExport): string
```

**Features:**
- **Generic Type Resolution**: Determines appropriate HTML element types
- **Icon Map Support**: Handles SVG generic types for icon components
- **HTML Element Support**: Creates union types for dynamic HTML elements
- **Own Props Generation**: Creates interface content for component-specific props

### Children Props Generation

```typescript
import { generateChildrenPropsContent } from './generation/generate-typescript-interface-children-props'

export function generateChildrenPropsContent(component: ComponentToExport): string
```

**Features:**
- **Validation Integration**: Uses prop validation to determine interface structure
- **Inline Component Support**: Handles props for components rendered inline
- **Hierarchical Traversal**: Recursively processes component trees
- **Prop Name Consistency**: Uses the same prop names map as the component function

### Prop Names Generation

**Prop Values Map** (`generation/shared/generate-prop-names-map.ts`):
```typescript
import { generatePropValuesMap } from './generation/shared/generate-prop-names-map'

export function generatePropValuesMap(
  component: ComponentToExport,
  workspace?: Workspace,
): Map<string, string>
```

Generates prop VALUE names map for variable names in generated code. These are unique, verbose names based on parent component's naming rules and component type.

**Features:**
- **Naming Strategy**: Varies based on depth and component type (inline, custom, default)
- **Direct Children (depth 1)**: Base name with numbering (button, button2, button3)
- **Grandchildren (depth 2)**: Inherit parent numbering or use component-specific logic
- **Duplicate Handling**: Automatically numbers duplicate prop names
- **Human Readable**: Converts complex paths to readable prop names

**Prop Keys Map** (`generation/preprocess/extract-prop-names-from-jsx.ts`):
```typescript
import { extractPropKeysFromJSX } from './generation/preprocess/extract-prop-names-from-jsx'

export function extractPropKeysFromJSX(
  jsxRoot: JSXNode,
  component: ComponentToExport,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): Map<string, string>
```

Extracts prop keys map from JSX structure. Maps node paths to prop key names for JSX attributes and interface keys.

### Default Props

```typescript
import { insertDefaultProps } from './generation/insert-default-props'

export function insertDefaultProps(
  source: string,
  component: ComponentToExport,
  nodeIdToClass?: Record<string, string>,
)
```

**Generated Structure:**
```typescript
const sdn: ButtonBarProps = {
  button: {
    label: {
      children: "Click me"
    },
    icon: {
      icon: "__default__"
    }
  },
  button2: {
    label: {
      children: "Cancel"
    }
  }
}
```

### Function Signature

```typescript
import { generatePropsSpread } from './generation/generate-react-function-signature'

export function generatePropsSpread(
  component: ComponentToExport,
  propNamesMap: Map<string, string>,
): string
```

**Generated Signature:**
```typescript
export function ButtonBar({
  className = "",
  button = sdn.button,
  button2 = sdn.button2,
  icon = "arrow-right",
  ...props
}: ButtonBarProps) {
  // Component implementation
}
```

### Import Management

```typescript
import { insertImports } from './generation/insert-imports'

export function insertImports(source: string, component: ComponentToExport): string
```

**Import Categories:**
- **React Types**: HTMLAttributes, CSSProperties, etc.
- **Component Imports**: Child component imports
- **Interface Imports**: TypeScript interface imports
- **Icon Imports**: Icon component imports
- **Utility Imports**: combineClassNames, etc.
- **Native Imports**: HTML element components

**Smart Import Logic:**
- **Tree Shaking**: Only imports actually used components
- **Inline Detection**: Handles components rendered inline vs. as imports
- **Validation Aware**: Adjusts imports based on prop validation results
- **Path Resolution**: Generates correct relative import paths

## Asset Processing

### Image Path Transformation

```typescript
import { replaceImagesWithRelativePaths } from './assets/transform-image-paths'

export function replaceImagesWithRelativePaths(
  workspace: Workspace,
  imagesToExport: ImageToExportMap,
): Workspace
```

**Features:**
- **Path Resolution**: Converts absolute paths to relative export paths
- **Background Images**: Updates background image properties
- **Source Images**: Updates image source properties
- **Immer Integration**: Uses immutable updates for workspace modification

### Asset Management Functions

```typescript
// Image files for export
import { getFilesToExportFromImagesToExport } from './assets/get-files-to-export-from-images-to-export'

// Font component files
import { getFontsComponent } from './assets/get-fonts-component'

// Icon component files with tree shaking
import { getIcons } from './assets/get-icons'

// Images for export
import { getImagesToExport } from './assets/get-images-to-export'
```

## Utilities

### Core Utility Functions

```typescript
// CSS class name combination and management
import { combineClassNames } from './utils/class-name'

// Utility file contents generation
import { getUtilityFileContents } from './utils/generate-utility-file-contents'

// Component level pluralization
import { pluralizeLevel } from './utils/pluralize-level'

// Universal source transformation
import { transformSource } from './utils/transform-source'
```

### Style Override Utilities

The class name utilities handle style override processing:

**`combineClassNames(defaultClassName, customClassName)`:**
- Merges default and custom class names
- Removes duplicate classes while preserving order
- Handles undefined and empty values gracefully
- Used throughout component generation for prop merging

**`getVariantClassNames(component, nodeIdToClass)`:**
- Generates variant-specific class names
- Combines default and variant classes when different
- Ensures proper class inheritance from design system

**`normalizeClassNames(classNames)`:**
- Removes duplicates and empty values from class arrays
- Maintains consistent class name formatting
- Used for cleaning up class name collections

**Example Usage:**
```typescript
// Frame className with user override
const frameClassName = combineClassNames("button-bar-frame", className)

// Child prop merging with class override
const buttonProps = { 
  ...sdn.button, 
  ...button, 
  className: combineClassNames(sdn.button?.className, button?.className) 
}
```

## Main Export Process

### Export Function

```typescript
import { exportReact } from './export-react'

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

For each component, the system generates a file through these steps:

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

**Generation Order:**
1. **Interface**: Creates TypeScript interface extending HTML element types
2. **Function**: Generates React component function with proper prop destructuring
3. **Defaults**: Creates default prop objects for component initialization
4. **Imports**: Manages all necessary imports with tree shaking and inline detection
5. **Special Cases**: Handles icon maps and other component-specific features
6. **Formatting**: Applies Prettier formatting and import sorting

**Component Processing Strategy:**
- Each component is validated against its schema during generation
- Components with valid props are imported as standard React components
- Components with invalid props are rendered inline with their children expanded
- Import statements are automatically adjusted based on rendering strategy
- This ensures optimal bundle size and preserves design customization intent

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

## Supporting Systems

### Constants and Markers

```typescript
export const MARKERS = {
  REMOVE_BLOCK_START: "[remove:block:start]",
  REMOVE_BLOCK_END: "[remove:block:end]",
  COMPONENT_BODY: "[insert_at:component_body]",
  BEFORE_COMPONENT: "[insert_at:before_component]",
  AFTER_COMPONENT: "[insert_at:after_component]",
} as const
```

**Marker Usage:**
- **REMOVE_BLOCK_START/END**: Mark sections of code to be removed during generation
- **COMPONENT_BODY**: Insertion point for component function body
- **BEFORE_COMPONENT**: Insertion point before component definition
- **AFTER_COMPONENT**: Insertion point after component definition

### Code Formatting

```typescript
import { format } from './format'

export async function format(content: string)
```

**Features:**
- **Prettier Integration**: Formats TypeScript code with consistent style
- **Import Sorting**: Uses `@trivago/prettier-plugin-sort-imports` for organized imports
- **Custom Import Order**: Prioritizes Seldon components and utilities
- **Double Formatting**: Runs formatting twice to ensure proper import organization

## Usage Examples

### Main Export Function

```typescript
import { exportReact } from '@seldon/factory/export/react'

const files = await exportReact(workspace, {
  rootDirectory: "./my-app",
  target: { framework: "react", styles: "css-properties" },
  output: {
    componentsFolder: "/src/components",
    assetsFolder: "/public/assets",
    assetPublicPath: "/assets",
  },
})
```

### Complete Factory Integration

```typescript
import { exportWorkspace } from '@seldon/factory'

const files = await exportWorkspace(workspace, {
  target: { framework: 'react', styles: 'css-properties' },
  output: {
    componentsFolder: '/src/components',
    assetsFolder: '/public/assets',
    assetPublicPath: '/assets'
  }
})
```

## Key Features Implementation

### Prop Inheritance and Merging

The system handles prop inheritance:
```typescript
// Default props from design
const defaultProps = {
  color: "#3b82f6",
  fontSize: "16px",
  padding: "12px"
}

// User props passed by consumer
const userProps = {
  color: "#ef4444", // Overrides default
  // fontSize and padding inherited from default
}

// Merged result
const finalProps = { ...defaultProps, ...userProps }
```

**Features:**
- **Default Props**: Component-level defaults from design
- **Parent Props**: Inherited from parent components  
- **User Props**: Props passed by the consumer
- **Class Merging**: Combines CSS classes intelligently

### Style Override Processing

The system processes style overrides through layers:

**1. CSS Class Generation and Ordering:**
- Base component classes are generated first (e.g., `sdn-button`)
- Variant classes follow with proper depth-based ordering
- Shallower nodes override deeper ones via CSS cascade
- Classes are sorted alphabetically within the same depth level

**2. Class Name Merging in Components:**
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

**3. Class Deduplication:**
- The `combineClassNames` utility removes duplicate classes
- Preserves order while eliminating redundancy
- Handles undefined and empty values gracefully

**4. CSS Cascade Optimization:**
- Base classes come before variant classes
- Depth-based ordering ensures proper override hierarchy
- Component-aware deduplication reduces bundle size
- Identical styles across components share classes

### Standard vs Inline Component Rendering

The system automatically determines whether to render components as standard imports or inline based on prop validation:

**Standard Component Rendering (Valid Props):**
```jsx
// Component matches schema - imported and used normally
<Button {...buttonProps} />
```

**Conditional Rendering (Missing Props):**
```jsx
// Component missing expected props - rendered conditionally
{button && (
  <Button {...buttonProps} />
)}
```

**Inline Component Rendering (Invalid Props):**
```jsx
// Component has extra props not in schema - rendered inline with children expanded
<Frame {...buttonProps}>
  <Icon {...iconProps} />
  <Label {...labelProps} />
</Frame>
```

This approach ensures that:
- Components with valid schemas are properly imported and tree-shaken
- Components with extra customization are rendered inline to preserve design intent
- Type safety is maintained through proper interface generation

### Dynamic HTML Elements

Components can render different HTML elements based on props:
```typescript
htmlElement?: "div" | "section" | "article"
```

### Icon Tree Shaking

Only used icons are imported and included in the final bundle.

### Type Safety

Full TypeScript support with:
- Generated interfaces for all components
- Proper HTML element typing
- Union types for restricted props
- Generic type parameters for flexibility

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
