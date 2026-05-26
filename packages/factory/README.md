# Seldon · Factory

The Seldon Factory System transforms valid Seldon workspaces into production-ready React components with optimized CSS. It serves as the core engine for converting design data into deployable component libraries with TypeScript support, theme integration, and asset optimization.

## System Architecture

The factory operates through a multi-stage pipeline that processes workspace data into exportable code. The system is organized into logical directories that reflect the pipeline stages:

1. **Workspace Computation** (`helpers/`) - Resolves all properties and inheritance relationships
2. **Style Generation** (`styles/`) - Converts design properties to CSS classes and stylesheets  
3. **Component Export** (`export/`) - Creates React components, CSS stylesheets, and asset processing
4. **Asset Processing** - Handles images, icons, fonts, and other media assets
5. **File Assembly** - Combines all generated content into exportable files

## Core Systems

### 1. Workspace Computation (`helpers/`)

The foundation of the factory system that resolves all property inheritance and computes property values.

#### Workspace Processing (`helpers/compute-workspace.ts`)

Resolves all property inheritance chains from parent to child components, computes complex property values, and builds complete property contexts for each node in the workspace.

**Key Features:**
- **Property Inheritance**: Automatic resolution of inherited properties from parent components
- **Computed Functions**: Handles computed functions like high contrast colors and optical padding
- **Theme Integration**: Applies theme variables and design tokens throughout the workspace
- **Context Building**: Creates complete property contexts for each component node

### 2. Style Generation (`styles/`)

The core style generation system that converts Seldon design properties into CSS.

#### CSS Properties Conversion (`styles/css-properties/get-css-from-properties.ts`)

Converts Seldon design properties to CSS properties, handles property inheritance from parent components, and applies theme variables and design tokens.

**Key Features:**
- **Property Resolution**: Computes property values (e.g., high contrast colors, computed functions)
- **Inheritance**: Handles property inheritance from parent components
- **Theme Integration**: Applies theme variables and design tokens
- **CSS Optimization**: Generates shorthand properties and removes undefined values
- **Comprehensive Coverage**: Supports all CSS properties including layout, typography, colors, shadows, borders, etc.

### 3. Component Export (`export/`)

The export system creates production-ready React components and CSS stylesheets. The system is organized into specialized subsystems:

- **[CSS Export System](./export/css/README.md)** - Generates production-ready stylesheets with "Tokens · Theme Variables" support
- **[React Export System](./export/react/README.md)** - Creates React components with full TypeScript support

#### Main Export Orchestration (`export/export-workspace.ts`)

The main orchestration function that coordinates the entire export process through a structured pipeline.

### 4. Asset Processing

The factory handles all media assets used in the workspace including images, icons, and fonts. Asset processing includes extraction, path transformation, optimization, tree-shaking, and component generation.

## Export Pipeline

The factory processes workspaces through a structured pipeline that maintains consistency and proper override precedence:

**Generation Order:**
1. **Workspace Computation**: Resolves all properties and inheritance chains
2. **Style Registry**: Builds CSS class mappings with proper override hierarchy
3. **Component Discovery**: Identifies exportable variants and builds component trees
4. **Asset Processing**: Handles images, icons, fonts, and other media
5. **Code Generation**: Creates React components, CSS stylesheets, and utility files
6. **File Assembly**: Combines all generated content into exportable files

## Key Features

### Property Inheritance and Merging

The factory system handles property inheritance across component hierarchies with automatic inheritance from parent components, selective override capabilities, and complete property context building.

### Theme System Integration

Theme support with CSS custom properties and design tokens that flow through the component hierarchy, maintaining visual consistency across the entire design system. The system generates comprehensive tokens and theme variables in CSS output.

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

## Generated Output

The factory produces a complete component library structure organized by component levels:

- **Primitives**: HTML primitives (Button, Input, Icon, etc.)
- **Elements**: Design elements (ButtonBar, Card, Navigation, etc.)
- **Parts**: Composite parts (Header, Footer, Sidebar, etc.)
- **Modules**: Complete modules (Navigation, Dashboard, etc.)
- **Icons**: Tree-shaken icon components
- **Utils**: Utility functions including CSS class name combination
- **Assets**: Images and other media with optimized paths

Each generated component includes TypeScript interfaces with fully typed props, React components with proper JSX structure, CSS classes with optimized styles, JSDoc comments for documentation, tree-shaken imports, and full theme integration support.

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

## Supporting Systems

### Constants and Configuration

The factory uses a comprehensive constants system for configuration including component levels, CSS prefixes, and default themes.

### Code Formatting

Handles code formatting with Prettier integration, import sorting with custom import order, and multi-format support for both TypeScript and CSS.

### Utility Functions

Shared utility functions including class name management, source transformation with append/prepend strategies, component utilities, and TypeScript utility types.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Seldon Factory System. When making changes to the factory functionality:

1. **Update this README first** to reflect the intended export behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the export pipeline** follows the documented workflow from workspace computation through file generation
4. **Ensure style override processing** maintains the documented class merging and cascade optimization
5. **Validate that component processing** follows the documented validation and rendering strategies

The factory system transforms valid Seldon workspaces through a structured pipeline that must maintain consistency with this documentation to ensure reliable component generation and proper style inheritance.

## Subsystem Documentation

For detailed implementation information, see the specific subsystem documentation:

- **[CSS Export System](./export/css/README.md)** - CSS generation with "Tokens · Theme Variables" support and cascade optimization
- **[React Export System](./export/react/README.md)** - React component generation with TypeScript support
- **[Technical Reference](./TECHNICAL.md)** - Code examples and implementation details





---

## Code Export Pipeline

### CSS Export Process
1. **Property Resolution** → Resolve all theme and computed values
2. **CSS Generation** → Convert properties to CSS classes
3. **Theme Variables** → Generate CSS custom properties as tokens for special case use in a project
4. **Class Deduplication** → Optimize CSS output by removing matching styles and combining classes.

```typescript
import { exportCss } from '@seldon/factory/export/css'

// Export CSS from workspace
const stylesheet = await exportCss(workspace)
```

### React Export Process
1. **Component Discovery** → Identify components to export
2. **Property Resolution** → Resolve all property values
3. **Interface Generation** → Create TypeScript interfaces
4. **Component Generation** → Generate React components

```typescript
import { exportReact } from '@seldon/factory/export/react'

// Export React components from workspace
const components = await exportReact(workspace, options)
```

### Future Code Exports

The properties system is designed to support additional export targets:

1. **Swift** - Native iOS components with UIKit/SwiftUI
2. **Java** - Android components with native Android views
3. **Flutter** - Cross-platform mobile components with Dart

These exports will follow the same property resolution pipeline, ensuring consistent design system implementation across all platforms.