# @seldon/factory

The Seldon Factory transforms valid Seldon workspaces into production-ready React components with optimized CSS. It serves as the core engine for converting design data into deployable component libraries with TypeScript support, theme integration, and asset optimization.

## Export Workflow

The factory follows a sequential pipeline that processes workspace data into exportable code:

1. **Workspace Computation** - Resolves all properties and inheritance relationships
2. **Style Generation** - Converts design properties to CSS classes and stylesheets
3. **Component Export** - Creates React components, CSS stylesheets, and asset processing
4. **Asset Processing** - Handles images, icons, fonts, and other media assets
5. **File Assembly** - Combines all generated content into exportable files

## Directory Structure

- **`helpers/`** - Workspace computation and property resolution
- **`styles/`** - CSS property conversion and style generation
- **`export/`** - React and CSS export systems with asset processing
- **`utils/`** - Shared utility functions and helpers

## Processing Stages

### 1. Workspace Computation (`helpers/`)

#### Workspace Processing (`helpers/compute-workspace.ts`)

The foundation of the factory system that resolves all property inheritance and computes property values:

```typescript
export function computeWorkspace(workspace: Workspace): Workspace
```

**Process:**

- Resolves all property inheritance chains from parent to child components
- Computes complex property values (e.g., high contrast colors, optical padding)
- Builds complete property contexts for each node in the workspace
- Handles theme variable resolution and design token application
- Ensures all computed properties are available for style and component generation

**Key Features:**

- **Property Inheritance**: Automatic resolution of inherited properties from parent components
- **Computed Functions**: Handles computed functions like high contrast colors and optical padding
- **Theme Integration**: Applies theme variables and design tokens throughout the workspace
- **Context Building**: Creates complete property contexts for each component node

### 2. Style Generation (`styles/`)

#### CSS Properties Conversion (`styles/css-properties/get-css-from-properties.ts`)

The core style generation system that converts Seldon design properties into CSS:

```typescript
export function getCssFromProperties(
  propertiesSubset: PropertiesSubset,
  context: StyleGenerationContext,
  className: string,
): string
```

**Process:**

- Converts Seldon design properties to CSS properties
- Handles property inheritance from parent components
- Applies theme variables and design tokens
- Generates optimized CSS with shorthand properties
- Removes undefined values and empty properties

**Key Features:**

- **Property Resolution**: Computes property values (e.g., high contrast colors, computed functions)
- **Inheritance**: Handles property inheritance from parent components
- **Theme Integration**: Applies theme variables and design tokens
- **CSS Optimization**: Generates shorthand properties and removes undefined values
- **Comprehensive Coverage**: Supports all CSS properties including layout, typography, colors, shadows, borders, etc.

### 3. Component Export (`export/`)

The export system creates production-ready React components and CSS stylesheets. For detailed documentation, see:

- **[CSS Export System](./export/css/README.md)** - Generates production-ready stylesheets with theme support
- **[React Export System](./export/react/README.md)** - Creates React components with full TypeScript support

#### Main Export Orchestration (`export/export-workspace.ts`)

The main orchestration function that coordinates the entire export process:

```typescript
export async function exportWorkspace(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]>
```

**Export Options:**

```typescript
type ExportOptions = {
  rootDirectory: string
  target: {
    framework: "react"
    styles: "css-properties"
  }
  output: {
    componentsFolder: string
    assetsFolder: string
    assetPublicPath: string
  }
}
```

### 4. Asset Processing

The factory handles all media assets used in the workspace. For detailed asset processing, see the [React Export System](./export/react/README.md#asset-processing) and [CSS Export System](./export/css/README.md) documentation.

**Asset Types:**

- **Images**: Extraction, path transformation, and optimization
- **Icons**: Tree-shaking and component generation
- **Fonts**: Custom typography and font-face declarations

## Main Export Process

### Export Function (`export/export-workspace.ts`)

The main orchestration function that coordinates the entire export process:

```typescript
export async function exportWorkspace(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]>
```

### Export Pipeline

The factory processes workspaces through a structured pipeline:

```typescript
// 1. Workspace computation
const computedWorkspace = computeWorkspace(workspace)

// 2. Style registry building
const { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths } =
  buildStyleRegistry(computedWorkspace)

// 3. Component discovery
const componentsToExport = getComponentsToExport(
  computedWorkspace,
  options,
  nodeIdToClass,
)

// 4. Asset processing
const imagesToExport = getImagesToExport(computedWorkspace, options)
const usedIconIds = getUsedIconIds(computedWorkspace)

// 5. Code generation
const files = await exportReact(computedWorkspace, options)
const stylesheet = await exportCss(computedWorkspace)
```

**Generation Order:**

1. **Workspace Computation**: Resolves all properties and inheritance chains
2. **Style Registry**: Builds CSS class mappings with proper override hierarchy
3. **Component Discovery**: Identifies exportable variants and builds component trees
4. **Asset Processing**: Handles images, icons, fonts, and other media
5. **Code Generation**: Creates React components, CSS stylesheets, and utility files
6. **File Assembly**: Combines all generated content into exportable files

## Usage Examples

### Complete Workspace Export

```typescript
import { exportWorkspace } from "@seldon/factory"

const workspace = {
  // Your Seldon workspace data with components, variants, and themes
}

const files = await exportWorkspace(workspace, {
  rootDirectory: "./my-app",
  target: {
    framework: "react",
    styles: "css-properties",
  },
  output: {
    componentsFolder: "/src/components",
    assetsFolder: "/public/assets",
    assetPublicPath: "/assets",
  },
})

// Write files to disk
for (const file of files) {
  await fs.writeFile(file.path, file.content)
}
```

### Individual System Usage

#### CSS Export Only

```typescript
import { exportCss } from "@seldon/factory/export/css"

const stylesheet = await exportCss(workspace)
// Returns complete CSS with reset styles, component styles, and theme variables
```

#### React Export Only

```typescript
import { exportReact } from "@seldon/factory/export/react"

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

#### Style Generation Only

```typescript
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"

const context = {
  properties: nodeProperties,
  parentContext: parentContext,
  theme: themeData,
}

const css = getCssFromProperties(properties, context, "my-component")
// Returns: ".my-component { color: #333; padding: 16px; }"
```

### Advanced Usage

#### Custom Export Configuration

```typescript
import { exportWorkspace } from "@seldon/factory"

const files = await exportWorkspace(workspace, {
  rootDirectory: "./my-design-system",
  target: {
    framework: "react",
    styles: "css-properties",
  },
  output: {
    componentsFolder: "/packages/core/components/src",
    assetsFolder: "/packages/core/components/public",
    assetPublicPath: "/assets",
  },
  // Additional options for customization
  includeTests: true,
  includeStorybook: true,
  formatCode: true,
})
```

## Generated Output

The factory produces a complete component library structure:

```
src/
├── components/
│   ├── primitives/           # HTML primitives (Button, Input, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Icon.tsx
│   ├── elements/             # Design elements (ButtonBar, Card, etc.)
│   │   ├── ButtonBar.tsx
│   │   ├── Card.tsx
│   │   └── Navigation.tsx
│   ├── parts/                # Composite parts (Header, Footer, etc.)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── modules/              # Complete modules (Navigation, etc.)
│   │   ├── Navigation.tsx
│   │   └── Dashboard.tsx
│   ├── icons/                # Tree-shaken icon components
│   │   ├── ArrowRight.tsx
│   │   ├── Check.tsx
│   │   └── Close.tsx
│   ├── utils/                # Utility functions
│   │   └── class-name.ts     # CSS class name combination utilities
│   ├── Fonts.tsx             # Font loading component
│   ├── Frame.tsx             # Universal container component
│   └── styles.css            # Complete stylesheet with themes
└── assets/                   # Images and other media
    └── images/
        ├── logo.png
        └── background.jpg
```

### Generated Output Examples

For detailed examples of generated components and CSS, see:

- **[React Export System - Generated Component Example](./export/react/README.md#generated-component-example)**
- **[CSS Export System - Generated CSS Example](./export/css/README.md)**

Each generated component includes:

- **TypeScript Interface**: Fully typed props with default values and HTML element extension
- **React Component**: Functional component with proper JSX structure and prop inheritance
- **CSS Classes**: Optimized styles with proper specificity and theme variable integration
- **JSDoc Comments**: Documentation for props and usage
- **Tree Shaking**: Only exports used icons and assets
- **Theme Integration**: Full support for custom themes and design tokens

## Key Features

### Property Inheritance and Merging

The factory system handles property inheritance across component hierarchies:

```typescript
// Parent component properties are automatically inherited by children
const parentProps = {
  color: "#3b82f6",
  fontSize: "16px",
  padding: "12px",
}

// Child components inherit and can override parent properties
const childProps = {
  color: "#ef4444", // Overrides parent color
  // fontSize and padding inherited from parent
}
```

**Features:**

- **Automatic Inheritance**: Child components inherit properties from parent instances
- **Selective Override**: Children can override specific inherited properties
- **Context Building**: Complete property contexts built for each component node
- **Theme Integration**: Theme variables applied throughout the inheritance chain

### Theme System Integration

Theme support with CSS custom properties and design tokens. For detailed theme processing, see the [CSS Export System](./export/css/README.md#theme-system-integration).

### CSS Cascade Optimization

CSS ordering ensures proper cascade and specificity. For detailed cascade processing, see the [CSS Export System](./export/css/README.md#style-override-processing).

### Type Safety and TypeScript Integration

TypeScript support with generated interfaces and type safety. For detailed TypeScript processing, see the [React Export System](./export/react/README.md#type-safety).

### Asset Optimization and Tree Shaking

Asset management with tree shaking and optimization. For detailed asset processing, see the [React Export System](./export/react/README.md#asset-processing).

**Features:**

- **Tree Shaking**: Only includes assets actually used in the workspace
- **Image Optimization**: Automatic image processing and format conversion
- **Path Transformation**: Converts absolute paths to relative export paths
- **Bundle Optimization**: Reduces final bundle size through efficient asset management

### Responsive Design Support

Built-in responsive design features with media query integration. For detailed responsive processing, see the [CSS Export System](./export/css/README.md#high-dpi-support).

### Code Generation Optimization

Code generation with formatting and optimization. For detailed code generation processing, see the [React Export System](./export/react/README.md#supporting-systems) and [CSS Export System](./export/css/README.md#supporting-systems).

**Features:**

- **Prettier Integration**: Automatic code formatting with consistent style
- **Import Sorting**: Organized imports with custom import order
- **JSDoc Generation**: Automatic documentation for components and props
- **License Headers**: Proper licensing headers for generated files

## Testing

For local testing, you can export to disk:

1. Copy your workspace data to `services/editor/scripts/test-workspace.ts`
2. Run `bun scripts/export.ts` from the `services/editor` directory
3. Files will be written to `services/export-test-app/` (git ignored)

This approach is faster than GitHub exports and allows for rapid iteration during development.

## Export Requirements

**Input Requirements:**

- Valid Seldon workspace with computed properties
- Export options specifying target framework and output paths
- Component variants must be properly configured in workspace
- Theme configuration must be properly set up

**Generated Output:**

- TypeScript interfaces for all components
- Optimized JSX structures with proper prop inheritance
- CSS class integration and stylesheet generation
- Tree-shaken imports and asset processing
- Production-ready React components and CSS

## Supporting Systems

### Constants and Configuration (`constants.ts`)

The factory uses a comprehensive constants system for configuration:

```typescript
export const EXPORT_CONFIG = {
  COMPONENT_LEVELS: {
    PRIMITIVE: "primitive",
    ELEMENT: "element",
    PART: "part",
    MODULE: "module",
  },
  CSS_PREFIX: "sdn-",
  DEFAULT_THEME: "primary",
} as const
```

### Code Formatting (`format.ts`)

Handles code formatting with Prettier and import sorting:

```typescript
export async function format(content: string): Promise<string>
```

**Features:**

- **Prettier Integration**: Formats TypeScript and CSS with consistent style
- **Import Sorting**: Uses `@trivago/prettier-plugin-sort-imports` for organized imports
- **Custom Import Order**: Prioritizes Seldon components and utilities
- **Multi-format Support**: Handles both TypeScript and CSS formatting

### Utility Functions (`utils/`)

Shared utility functions for the factory system:

```typescript
// Class name combination
export function combineClassNames(...classes: (string | undefined)[]): string

// Source transformation
export function transformSource(
  source: string,
  insertions: SourceInsertion[],
): string

// Component level pluralization
export function pluralizeLevel(level: ComponentLevel): string
```

**Features:**

- **Class Name Management**: Intelligent CSS class combination
- **Source Transformation**: Universal source transformation with append/prepend strategies
- **Component Utilities**: Helper functions for component processing
- **Type Utilities**: TypeScript utility types and helpers

## Usage as Source of Truth

This README serves as the authoritative documentation for the Seldon Factory System. When making changes to the factory functionality:

1. **Update this README first** to reflect the intended export behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the export pipeline** follows the documented workflow from workspace computation through file generation
4. **Ensure style override processing** maintains the documented class merging and cascade optimization
5. **Validate that component processing** follows the documented validation and rendering strategies

The factory system transforms valid Seldon workspaces through a structured pipeline that must maintain consistency with this documentation to ensure reliable component generation and proper style inheritance.
