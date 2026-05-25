# Seldon Factory System - Technical Reference

This document provides comprehensive code examples and implementation details for the Seldon Factory System.

## Workspace Computation

### Workspace Processing

```typescript
import { computeWorkspace } from '@seldon/factory/helpers'

export function computeWorkspace(workspace: Workspace): Workspace {
  // Resolves all property inheritance chains from parent to child components
  // Computes complex property values (e.g., high contrast colors, optical padding)
  // Builds complete property contexts for each node in the workspace
  // Handles theme variable resolution and design token application
}
```

**Key Features:**
- **Property Inheritance**: Automatic resolution of inherited properties from parent components
- **Computed Functions**: Handles computed functions like high contrast colors and optical padding
- **Theme Integration**: Applies theme variables and design tokens throughout the workspace
- **Context Building**: Creates complete property contexts for each component node

## Style Generation

### CSS Properties Conversion

```typescript
import { getCssFromProperties } from '@seldon/factory/styles/css-properties'

export function getCssFromProperties(
  propertiesSubset: PropertiesSubset,
  context: StyleGenerationContext,
  className: string,
): string {
  // Converts Seldon design properties to CSS properties
  // Handles property inheritance from parent components
  // Applies theme variables and design tokens
  // Generates optimized CSS with shorthand properties
  // Removes undefined values and empty properties
}
```

**Key Features:**
- **Property Resolution**: Computes property values (e.g., high contrast colors, computed functions)
- **Inheritance**: Handles property inheritance from parent components
- **Theme Integration**: Applies theme variables and design tokens
- **CSS Optimization**: Generates shorthand properties and removes undefined values
- **Comprehensive Coverage**: Supports all CSS properties including layout, typography, colors, shadows, borders, etc.

## Component Export

### Main Export Orchestration

```typescript
import { exportWorkspace } from '@seldon/factory'

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

### Export Pipeline

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

## Generated Output Structure

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

## Property Inheritance and Merging

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

## Supporting Systems

### Constants and Configuration

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

### Code Formatting

```typescript
export async function format(content: string): Promise<string> {
  // Prettier integration for automatic formatting
  // Import sorting with custom import order
  // Multi-format support for both TypeScript and CSS
}
```

**Features:**
- **Prettier Integration**: Formats TypeScript and CSS with consistent style
- **Import Sorting**: Uses `@trivago/prettier-plugin-sort-imports` for organized imports
- **Custom Import Order**: Prioritizes Seldon components and utilities
- **Multi-format Support**: Handles both TypeScript and CSS formatting

### Utility Functions

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

## Generated CSS Example

```css
/* Reset styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base styles */
:root {
  font-size: 16px;
  --sdn-hairline: 0.5px;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  :root {
    --sdn-hairline: 0.5px;
  }
}

/* Theme variables */
:root {
  --sdn-theme-primary-ratio: 1.5;
  --sdn-theme-primary-font-size: 16px;
  --sdn-theme-primary-base-color: #3b82f6;
  --sdn-theme-primary-color-primary: #3b82f6;
  --sdn-theme-primary-color-secondary: #64748b;
}

/* Component styles */
.sdn-button-bar-frame {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sdn-button {
  padding: 8px 16px;
  border-radius: 6px;
  background-color: var(--sdn-theme-primary-color-primary);
  color: white;
  border: none;
  cursor: pointer;
}
```

## Key Features Implementation

### Property Inheritance and Merging

The factory system handles property inheritance across component hierarchies with automatic inheritance from parent components, selective override capabilities, and complete property context building.

### Theme System Integration

Theme support with CSS custom properties and design tokens that flow through the component hierarchy, maintaining visual consistency across the entire design system.

### CSS Cascade Optimization

CSS ordering ensures proper cascade and specificity with intelligent class ordering, depth-based hierarchy, and optimized specificity management.

### Type Safety and TypeScript Integration

TypeScript support with generated interfaces, proper HTML element typing, union types for restricted props, and generic type parameters for flexibility.

### Asset Optimization and Tree Shaking

Asset management with tree shaking that only includes assets actually used in the workspace, automatic image processing and format conversion, path transformation from absolute to relative export paths, and bundle optimization through efficient asset management.

### Responsive Design Support

Built-in responsive design features with media query integration, high-DPI support, and cross-device compatibility.

### Code Generation Optimization

Code generation with Prettier integration for automatic formatting, import sorting with custom import order, JSDoc generation for automatic documentation, and proper licensing headers for generated files.

## Testing

For local testing, export a `workspace.json` file from `packages/editor` and feed that workspace data into the factory entrypoints directly. The older hosted export harness is not part of this baseline repo.

## Export Requirements

**Input Requirements:**
- Valid Seldon workspace with computed properties
- Export options specifying target framework and output paths
- Component variants properly configured in workspace
- Theme configuration properly set up

**Generated Output:**
- TypeScript interfaces for all components
- Optimized JSX structures with proper prop inheritance
- CSS class integration and stylesheet generation
- Tree-shaken imports and asset processing
- Production-ready React components and CSS
