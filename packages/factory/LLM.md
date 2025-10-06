# Seldon Factory - LLM Reference

## Quick Start for LLMs

**Core Purpose**: Transforms valid Seldon workspaces into production-ready React components with optimized CSS. It serves as the core engine for converting design data into deployable component libraries with full TypeScript support, theme integration, and asset optimization.

**Key Features**:
- **Workspace Computation**: Resolves all properties and inheritance relationships
- **Style Generation**: Converts design properties to CSS classes and stylesheets
- **Component Export**: Creates React components, CSS stylesheets, and asset processing
- **Asset Processing**: Handles images, icons, fonts, and other media assets
- **File Assembly**: Combines all generated content into exportable files

## Export Workflow (CRITICAL)

The factory follows a sequential pipeline that processes workspace data into exportable code:

1. **Workspace Computation** - Resolves all properties and inheritance relationships
2. **Style Generation** - Converts design properties to CSS classes and stylesheets
3. **Component Export** - Creates React components, CSS stylesheets, and asset processing
4. **Asset Processing** - Handles images, icons, fonts, and other media assets
5. **File Assembly** - Combines all generated content into exportable files

## Main Export Process

### Export Function
```typescript
export async function exportWorkspace(
  workspace: Workspace,
  options: ExportOptions
): Promise<FileToExport[]>
```

**Process Flow:**
1. **Workspace Computation**: Resolves all properties and inheritance chains
2. **Style Registry**: Builds CSS class mappings from workspace
3. **Component Discovery**: Identifies components to export from variants
4. **Asset Processing**: Handles images, icons, fonts, and other media
5. **Code Generation**: Creates React components, CSS stylesheets, and utility files
6. **File Organization**: Structures output according to target framework and configuration

### Export Pipeline

The factory processes workspaces through a structured pipeline:

```typescript
// 1. Workspace computation
const computedWorkspace = computeWorkspace(workspace)

// 2. Style registry building
const { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths } = 
  buildStyleRegistry(computedWorkspace)

// 3. Component discovery
const componentsToExport = getComponentsToExport(computedWorkspace, options, nodeIdToClass)

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

## Processing Stages

### 1. Workspace Computation (`helpers/`)

The foundation of the factory system that resolves all property inheritance and computes complex property values:

```typescript
export function computeWorkspace(workspace: Workspace): Workspace
```

**Process:**
- Resolves all property inheritance chains from parent to child components
- Computes complex property values (e.g., high contrast colors, optical padding)
- Builds complete property contexts for each node in the workspace
- Handles theme variable resolution and design token application
- Ensures all computed properties are available for style and component generation

### 2. Style Generation (`styles/`)

The core style generation system that converts Seldon design properties into CSS:

```typescript
export function getCssFromProperties(
  propertiesSubset: PropertiesSubset,
  context: StyleGenerationContext,
  className: string
): string
```

**Process:**
- Converts Seldon design properties to CSS properties
- Handles property inheritance from parent components
- Applies theme variables and design tokens
- Generates optimized CSS with shorthand properties
- Removes undefined values and empty properties

### 3. Component Export (`export/`)

The export system creates production-ready React components and CSS stylesheets:

- **[CSS Export System](./export/css/README.md)** - Generates production-ready stylesheets with theme support
- **[React Export System](./export/react/README.md)** - Creates React components with full TypeScript support

### 4. Asset Processing

Handles all media assets used in the workspace:

```typescript
// Image processing
export function getImagesToExport(workspace: Workspace, options: ExportOptions): FileToExport[]
export function transformImagePaths(workspace: Workspace, imagesToExport: FileToExport[]): Workspace

// Icon processing (tree-shaken)
export function getUsedIconIds(workspace: Workspace): Set<IconId>
export function getIcons(usedIconIds: Set<IconId>, options: ExportOptions): FileToExport[]

// Font processing
export function getFontsComponent(workspace: Workspace, options: ExportOptions): Promise<FileToExport>

// Utility files
export function getUtilityFileContents(options: ExportOptions): FileToExport[]
```

## Data Structures

### Export Options
```typescript
type ExportOptions = {
  rootDirectory: string
  target: {
    framework: 'react'
    styles: 'css-properties'
  }
  output: {
    componentsFolder: string
    assetsFolder: string
    assetPublicPath: string
  }
}
```

### File Export
```typescript
type FileToExport = {
  path: string
  content: string | ArrayBuffer
}
```

### Image Export Map
```typescript
type ImageToExportMap = Record<
  string,
  { relativePath: string; uploadPath: string }
>
```

## Key Features

### Property Inheritance and Merging

The factory system handles complex property inheritance across component hierarchies:

```typescript
// Parent component properties are automatically inherited by children
const parentProps = {
  color: "#3b82f6",
  fontSize: "16px",
  padding: "12px"
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

### Asset Optimization and Tree Shaking

Efficient asset management with tree shaking and optimization:

```typescript
// Only used icons are imported and included
const usedIconIds = getUsedIconIds(workspace) // Set<IconId>
const iconComponents = getIcons(usedIconIds, options)

// Font loading component with Google Fonts integration
const fontsComponent = await getFontsComponent(workspace, options)

// Image optimization and path transformation
const imagesToExport = getImagesToExport(workspace, options)
const optimizedWorkspace = transformImagePaths(workspace, imagesToExport)

// Utility files for component functionality
const utilityFiles = getUtilityFileContents(options)
```

**Features:**
- **Tree Shaking**: Only includes assets actually used in the workspace
- **Icon Components**: Individual React components for each used icon
- **Font Loading**: Automatic Google Fonts integration with `<link>` tags
- **Image Optimization**: Automatic image processing and format conversion
- **Path Transformation**: Converts absolute paths to relative export paths
- **Utility Generation**: Essential utility functions like `combineClassNames`
- **Bundle Optimization**: Reduces final bundle size through efficient asset management

### Generated Components

The factory generates several essential components beyond the workspace components:

**Frame Component**:
```typescript
// Universal container component for all workspace nodes
export function Frame({ children, className, ...props }: FrameProps) {
  return <div className={combineClassNames("frame", className)} {...props}>
    {children}
  </div>
}
```

**Fonts Component**:
```typescript
// Font loading component with Google Fonts integration
export function Fonts() {
  return <>
    <link key="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    <link key="Roboto" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
  </>
}
```

**Icon Components**:
```typescript
// Tree-shaken icon components (only used icons are generated)
export function ArrowRight({ className, ...props }: IconProps) {
  return <svg className={combineClassNames("icon", className)} {...props}>
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
}
```

**Utility Functions**:
```typescript
// CSS class name combination utilities
export function combineClassNames(defaultClassName?: string, customClassName?: string): string {
  // Combines and deduplicates CSS class names
}
```

### Code Generation Optimization

Advanced code generation with formatting and optimization:

```typescript
// Automatic code formatting with Prettier
const formattedCode = await format(generatedCode)

// Import sorting and organization
import { HTMLAttributes } from "react"
import { combineClassNames } from "../utils/class-name"
import { Button } from "../elements/Button"
import { Icon } from "../primitives/Icon"
```

**Features:**
- **Prettier Integration**: Automatic code formatting with consistent style
- **Import Sorting**: Organized imports with custom import order
- **JSDoc Generation**: Automatic documentation for components and props
- **License Headers**: Proper licensing headers for generated files

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
- Tree-shaken icon components and font loading
- Universal Frame component for container functionality
- Utility functions for CSS class management
- Production-ready React components and CSS

## Generated Output Structure

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

## LLM Guidelines

### ✅ DO
- Understand the workspace computation step before export
- Use proper export options configuration
- Handle property inheritance correctly
- Process assets with tree shaking
- Generate proper TypeScript interfaces
- Use the structured export pipeline
- Apply proper code formatting
- Handle theme integration throughout
- Use the style registry for CSS generation
- Process all workspace nodes for complete coverage
- Maintain proper file organization
- Handle asset optimization correctly
- Generate Frame component for universal containers
- Create Fonts component for Google Fonts integration
- Generate utility files for CSS class management
- Include tree-shaken icon components

### ❌ DON'T
- Skip workspace computation before export
- Ignore export options configuration
- Mutate workspace objects directly
- Skip asset tree shaking
- Generate invalid TypeScript interfaces
- Bypass the structured export pipeline
- Generate unformatted code
- Ignore theme integration
- Skip style registry building
- Process only partial workspace data
- Create invalid file structures
- Skip asset optimization
- Forget to generate Frame component
- Skip Fonts component generation
- Omit utility file generation
- Include unused icon components

## Common Patterns

**Complete Workspace Export**:
```typescript
const files = await exportWorkspace(workspace, {
  rootDirectory: './my-app',
  target: { framework: 'react', styles: 'css-properties' },
  output: {
    componentsFolder: '/src/components',
    assetsFolder: '/public/assets',
    assetPublicPath: '/assets'
  }
})
```

**Individual System Usage**:
```typescript
// CSS export only
const stylesheet = await exportCss(workspace)

// React export only
const files = await exportReact(workspace, options)

// Style generation only
const css = getCssFromProperties(properties, context, 'my-component')
```

**Asset Processing**:
```typescript
const imagesToExport = getImagesToExport(workspace, options)
const usedIconIds = getUsedIconIds(workspace)
const iconComponents = getIcons(usedIconIds, options)
const fontsComponent = await getFontsComponent(workspace, options)
const utilityFiles = getUtilityFileContents(options)
const optimizedWorkspace = transformImagePaths(workspace, imagesToExport)
```

## Quick Reference

**Core Imports**:
```typescript
import { exportWorkspace } from '@seldon/factory'
import { exportCss } from '@seldon/factory/export/css'
import { exportReact } from '@seldon/factory/export/react'
import { computeWorkspace } from '@seldon/factory/helpers/compute-workspace'
import { getCssFromProperties } from '@seldon/factory/styles/css-properties/get-css-from-properties'
```

**Common Patterns**:
- Complete export: `exportWorkspace(workspace, options)`
- CSS export: `exportCss(workspace)`
- React export: `exportReact(workspace, options)`
- Workspace computation: `computeWorkspace(workspace)`
- Style generation: `getCssFromProperties(properties, context, className)`
- Asset processing: `getImagesToExport(workspace, options)`, `getUsedIconIds(workspace)`, `getIcons(usedIconIds, options)`, `getFontsComponent(workspace, options)`
- Utility generation: `getUtilityFileContents(options)`
