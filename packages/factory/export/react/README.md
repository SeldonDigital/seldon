# React Export System

The React export system transforms valid Seldon workspaces into production-ready React components with TypeScript support. It processes workspace variants, validates component schemas, and generates component files with prop inheritance and JSX structures.

## Export Workflow

The system follows a pipeline that processes workspace data into exportable React components:

1. **Workspace Computation** - Resolves all properties and inheritance chains
2. **Component Discovery** - Identifies exportable variants and builds component trees
3. **Validation** - Validates component props against schemas
4. **Code Generation** - Creates TypeScript interfaces, React components, and imports
5. **Asset Processing** - Handles images, icons, fonts, and other assets
6. **File Assembly** - Combines all generated content into exportable files


## Processing Stages

### 1. Workspace Computation

The export process begins by computing the workspace to resolve all property inheritance and design token values:

```typescript
let workspace = computeWorkspace(input)
```

This step ensures all component properties are fully resolved before export.

### 2. Component Discovery (`discovery/`)

#### Component Identification (`discovery/get-components-to-export.ts`)

Identifies which workspace variants should be exported as React components:

```typescript
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

#### Tree Building (`discovery/get-json-tree-from-children.ts`)

Converts workspace component hierarchies into structured JSON trees that represent the component structure:

```typescript
export function getJsonTreeFromChildren(
  variant: Variant,
  workspace: Workspace,
  nodeIdToClass: Record<string, string>,
): JSONTreeNode
```

#### Data Extraction Functions

- **`get-component-name.ts`**: Extracts and formats component names from workspace nodes
- **`get-human-readable-prop-name.ts`**: Converts technical prop paths to human-readable names
- **`get-icon-component-name.ts`**: Generates icon component names from icon IDs
- **`get-node-origin-chain.ts`**: Traces the origin chain of component nodes
- **`get-simple-prop-name.ts`**: Extracts simple prop names from complex paths
- **`get-used-icon-ids.ts`**: Identifies all icons used in workspace for tree shaking

```typescript
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

### 3. Validation (`validation/`)

#### Component Prop Validation (`validation/validate-component-props.ts`)

Validates component props against their schemas to determine rendering strategy:

```typescript
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

#### Standard vs Inline Component Processing

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

### 4. Code Generation (`generation/`)

#### Interface Generation (`generation/insert-interface.ts`)

Generates TypeScript interfaces that extend appropriate HTML element types:

```typescript
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

#### Component Function Generation (`generation/insert-component-function.ts`)

Creates the main React component function with proper JSX structure:

```typescript
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
- **Simple Components**: Single child with inline return
- **Complex Components**: Multi-line JSX with parentheses
- **HTML Element Components**: Dynamic HTML element rendering
- **Icon Map Components**: Icon mapping functionality
- **Frame Components**: Layout container components

#### JSX Tree Building (`generation/generate-react-jsx-tree.ts`)

The JSX generation engine that creates the component's render structure:

```typescript
export function generateJSXTree(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
): string
```

**Generation Strategies:**

**Simple Components (Single Child):**
```jsx
return <div className={frameClassName} {...props}>
    <Button {...buttonProps} />
</div>
```

**Complex Components (Multiple Children):**
```jsx
return (
    <div className={frameClassName} {...props}>
        <Button {...buttonProps} />
        <Icon {...iconProps} />
    </div>
)
```

**Custom Components (Invalid Props):**
```jsx
return (
    <div className={frameClassName} {...props}>
        {button && (
            <Button {...buttonProps} />
        )}
    </div>
)
```

**Inline Components (Extra Props):**
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

#### Return Statement Generation (`generation/generate-react-component-return-statements.ts`)

Generates different types of return statements based on component configuration:

```typescript
export function generateIconMapReturn(component: ComponentToExport, nodeIdToClass: NodeIdToClass): string
export function generateHtmlElementReturn(component: ComponentToExport, nodeIdToClass: NodeIdToClass): string
export function generateSimpleReturn(component: ComponentToExport, nodeIdToClass: NodeIdToClass): string
```

**Return Types:**
- **Icon Map Returns**: Dynamic icon rendering with fallback handling
- **HTML Element Returns**: Switch statements for dynamic HTML element rendering
- **Simple Returns**: Direct component returns for basic components

#### Interface Base Generation (`generation/generate-typescript-interface-base.ts`)

Handles the base structure and generic types for TypeScript interfaces:

```typescript
export function getGenericAndParameters(component: ComponentToExport)
export function generateOwnPropsContent(component: ComponentToExport): string
```

**Features:**
- **Generic Type Resolution**: Determines appropriate HTML element types
- **Icon Map Support**: Handles SVG generic types for icon components
- **HTML Element Support**: Creates union types for dynamic HTML elements
- **Own Props Generation**: Creates interface content for component-specific props

#### Children Props Generation (`generation/generate-typescript-interface-children-props.ts`)

Generates interface content for child component props with validation awareness:

```typescript
export function generateChildrenPropsContent(component: ComponentToExport): string
```

**Features:**
- **Validation Integration**: Uses prop validation to determine interface structure
- **Inline Component Support**: Handles props for components rendered inline
- **Hierarchical Traversal**: Recursively processes component trees
- **Prop Name Consistency**: Uses the same prop names map as the component function

#### Prop Names Generation (`generation/generate-prop-names-map.ts`)

Creates consistent prop names across the entire component:

```typescript
export function generatePropNamesMap(component: ComponentToExport): Map<string, string>
```

**Features:**
- **Consistent Naming**: Same prop names used in interface, function params, and JSX
- **Duplicate Handling**: Automatically numbers duplicate prop names (button, button2, button3)
- **Human Readable**: Converts complex paths to readable prop names
- **Props Suffix**: Maintains "Props" suffix for prop objects

##### Default Props (`generation/insert-default-props.ts`)

Generates default prop objects for component initialization:

```typescript
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

##### Function Signature (`generation/generate-react-function-signature.ts`)

Creates the component function signature with proper prop destructuring:

```typescript
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

#### Import Management (`generation/insert-imports.ts`)

Intelligently manages all necessary imports for the component:

```typescript
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

### 5. Asset Processing (`assets/`)

#### Image Path Transformation (`assets/transform-image-paths.ts`)

Transforms absolute image paths to relative paths for export:

```typescript
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

#### Asset Management Functions

- **`get-files-to-export-from-images-to-export.ts`**: Processes image files for export
- **`get-fonts-component.ts`**: Generates font component files
- **`get-icons.ts`**: Creates icon component files with tree shaking
- **`get-images-to-export.ts`**: Identifies and processes images for export

### 6. Utilities (`utils/`)

#### Core Utility Functions

- **`class-name.ts`**: CSS class name combination and management
- **`generate-utility-file-contents.ts`**: Generates utility file contents
- **`pluralize-level.ts`**: Pluralizes component level names
- **`transform-source.ts`**: Universal source transformation with append/prepend strategies

#### Style Override Utilities (`utils/class-name.ts`)

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

### Export Function (`export-react.ts`)

The main orchestration function that coordinates the export process:

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

### Generated Component Example

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

### Constants and Markers (`constants.ts`)

Defines markers used throughout the code generation process for content insertion and removal:

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

### Code Formatting (`format.ts`)

Handles code formatting with Prettier and import sorting:

```typescript
export async function format(content: string)
```

**Features:**
- **Prettier Integration**: Formats TypeScript code with consistent style
- **Import Sorting**: Uses `@trivago/prettier-plugin-sort-imports` for organized imports
- **Custom Import Order**: Prioritizes Seldon components and utilities
- **Double Formatting**: Runs formatting twice to ensure proper import organization


## Key Features

### Prop Inheritance and Merging

The system handles prop inheritance:
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


## Usage

The React export system is used through the main factory export function:

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

**Export Requirements:**
- Valid Seldon workspace with computed properties
- Export options specifying target framework and output paths
- Component variants must be properly configured in workspace

**Generated Output:**
- TypeScript interfaces for all components
- Optimized JSX structures with proper prop inheritance
- CSS class integration and stylesheet generation
- Tree-shaken imports and asset processing
- Production-ready React components

## Usage as Source of Truth

This README serves as the documentation for the React Export System. When making changes to the React export functionality:

1. **Update this README first** to reflect the intended export behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the export pipeline** follows the documented workflow from workspace computation through file generation
4. **Ensure style override processing** maintains the documented class merging and cascade optimization
5. **Validate that standard vs inline component processing** follows the documented validation and rendering strategies

The React export system transforms valid Seldon workspaces through a pipeline that must maintain consistency with this documentation to ensure reliable component generation and proper style inheritance.
