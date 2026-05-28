# Factory React Export System

The Factory React Export System is a code generation engine that transforms Seldon design workspaces into production-ready React components with full TypeScript support. It handles complex component hierarchies, prop inheritance, and generates optimized JSX structures.

The React export system operates through a multi-stage pipeline that converts workspace data into complete React component files. The system is organized into logical directories that reflect the pipeline stages:

1. **Component Discovery** (`discovery/`) - Identifies components to export and creates JSON representation of component hierarchies
2. **Validation** (`validation/`) - Validates component props and schemas
3. **Code Generation** (`generation/`) - Generates TypeScript interfaces, React components, imports, and all code
4. **Asset Processing** (`assets/`) - Handles images, icons, fonts, and other assets
5. **Utilities** (`utils/`) - Shared utility functions and helpers

## System Architecture

### Pipeline Stages

#### 1. Component Discovery (`discovery/`)

**Component Identification** (`discovery/get-components-to-export.ts`)
The entry point for discovering which components to export from a workspace. Filters workspace variants, maps each variant to a ComponentToExport object, determines output paths based on component level, creates JSON tree representation for each component, and associates export configuration for each component type.

**Tree Building** (`discovery/get-json-tree-from-children.ts`)
Converts workspace component hierarchies into structured JSON trees that represent the component structure with hierarchical structure maintenance, property mapping to React props, reference management for duplicate component names, display filtering for hidden components, and CSS class integration.

**Data Extraction Functions**
- **`get-component-name.ts`**: Extracts and formats component names from workspace nodes
- **`get-human-readable-prop-name.ts`**: Converts technical prop paths to human-readable names
- **`get-icon-component-name.ts`**: Generates icon component names from icon IDs
- **`get-node-origin-chain.ts`**: Traces the origin chain of component nodes
- **`get-simple-prop-name.ts`**: Extracts simple prop names from complex paths
- **`get-used-icon-ids.ts`**: Identifies all icons used in workspace for tree shaking

#### 2. Validation (`validation/`)

**Component Prop Validation** (`validation/validate-component-props.ts`)
Validates component props against their schemas to determine rendering strategy by comparing proposed children against component schema, separating valid props from invalid props, determining if component uses fewer props than specified in schema, and mapping component names to ComponentIds for validation.

#### 3. Code Generation (`generation/`)

**Interface Generation** (`generation/insert-interface.ts`)
Generates TypeScript interfaces that extend appropriate HTML element types by determining base HTML element type from component configuration, generating own props from component properties, adding children props for nested components, creating union types for props with multiple options, and extending appropriate HTML attributes interface.

**Component Function Generation** (`generation/insert-component-function.ts`)
Creates the main React component function with proper JSX structure through prop names mapping for consistent prop names across interface and JSX, variable declarations for prop variable declarations with class merging, return statement creation based on component type, and JSDoc comment addition for component documentation.

**JSX Structure Generation** (`generation/preprocess/generate-jsx-structure.ts`)
The core JSX structure generation engine that creates structured JSX representation with correct sequential prop names. The system uses a preprocess pipeline that:
- Generates JSX structure with correct prop names from the start
- Handles grandchildren passed as props
- Supports sequential numbering across the entire tree
- Converts JSX structure to string via `jsx-structure-to-string.ts`

**Component Rendering Strategies**:
- **Regular Component**: Components with valid props matching the schema (with or without children)
- **Custom Component**: Components with invalid props (extra props not in schema), rendered conditionally
- **Inline Component**: Components with invalid child props, wrapped in a Frame with inline rendering
- **Regular Inline Component**: Components with all valid child props that have grandchildren. Only used when grandchildren are present and a Frame wrapper is needed (unlike Inline Component which wraps invalid props in a Frame)
- **Custom Inline Component**: Components with invalid props (extra props not in schema), rendered conditionally, with children and grandchildren

**Return Statement Generation** (`generation/generate-react-component-return-statements.ts`)
Generates different types of return statements based on component configuration including icon map returns for dynamic icon rendering with fallback handling, HTML element returns with switch statements for dynamic HTML element rendering, and simple returns for direct component returns for basic components.

**Interface Base Generation** (`generation/generate-typescript-interface-base.ts`)
Handles the base structure and generic types for TypeScript interfaces with generic type resolution for appropriate HTML element types, icon map support for SVG generic types, HTML element support for union types, and own props generation for component-specific props.

**Children Props Generation** (`generation/generate-typescript-interface-children-props.ts`)
Generates interface content for child component props with validation awareness using validation integration to determine interface structure, inline component support for props rendered inline, hierarchical traversal for recursive component tree processing, and prop name consistency using the same prop names map as the component function.

**Prop Names Generation** (`generation/shared/generate-prop-names-map.ts`)
Generates prop value names map for variable names in generated code. The naming strategy varies based on depth and component type (inline, custom, default), with direct children using base names with numbering and grandchildren inheriting parent numbering or using component-specific logic. Prop keys are extracted from JSX structure via `generation/preprocess/extract-prop-names-from-jsx.ts`.

**Default Props** (`generation/insert-default-props.ts`)
Generates default prop objects for component initialization with structured default prop objects for component initialization.

**Function Signature** (`generation/generate-react-function-signature.ts`)
Creates the component function signature with proper prop destructuring.

**Import Management** (`generation/insert-imports.ts`)
Intelligently manages all necessary imports for the component with import categories for React types, component imports, interface imports, icon imports, utility imports, and native imports, plus smart import logic with tree shaking, inline detection, validation awareness, and path resolution.

#### 4. Asset Processing (`assets/`)

**Image Path Transformation** (`assets/transform-image-paths.ts`)
Transforms absolute image paths to relative paths for export with path resolution, background image updates, source image updates, and Immer integration for immutable workspace modification.

**Asset Management Functions**
- **`get-files-to-export-from-images-to-export.ts`**: Processes image files for export
- **`get-fonts-component.ts`**: Generates font component files
- **`get-icons.ts`**: Creates icon component files with tree shaking
- **`get-images-to-export.ts`**: Identifies and processes images for export

#### 5. Utilities (`utils/`)

**Core Utility Functions**
- **`class-name.ts`**: CSS class name combination and management
- **`generate-utility-file-contents.ts`**: Generates utility file contents
- **`pluralize-level.ts`**: Pluralizes component level names
- **`transform-source.ts`**: Universal source transformation with append/prepend strategies

## Component Generation Pipeline

### 1. Main Export Process (`export-react.ts`)
The main orchestration function that coordinates the entire export process through workspace computation, style registry building, component discovery, icon collection, stylesheet generation, image processing, component generation, supporting files generation, and license addition.

### 2. Component File Generation
For each component, the system generates a complete file through interface generation, component function generation, default props generation, import management, special handling for icon maps, and code formatting.

### 3. Generated Component Example
**Input**: ButtonBar component with two buttons and an icon

**Generated Output**: Complete TypeScript interface with HTML element extension, React component function with proper JSX structure, default prop objects, and comprehensive import management.

## Supporting Systems

### Constants and Markers (`constants.ts`)
The constants file defines markers used throughout the code generation process for content insertion and removal with remove block markers, component body insertion points, and before/after component insertion points.

### Code Formatting (`format.ts`)
Handles code formatting with Prettier integration, import sorting with custom import order, and double formatting for proper import organization.

## Advanced Features

### 1. Prop Inheritance and Merging
The system handles complex prop inheritance across component hierarchies with automatic inheritance from parent components, selective override capabilities, and complete property context building.

### 2. Style Override Processing
The system processes style overrides through CSS class generation and ordering, class name merging in components, class deduplication, and CSS cascade optimization.

### 3. Component Rendering Strategies
The system automatically determines component rendering based on prop validation:
- **Regular Component**: Rendered as standard imports for valid props matching the schema
- **Custom Component**: Rendered conditionally for invalid props (extra props not in schema)
- **Inline Component**: Wrapped in a Frame with inline rendering for invalid child props
- **Regular Inline Component**: Standard rendering with grandchildren prop mapping. Only used when grandchildren are present and a Frame wrapper is needed (unlike Inline Component which wraps invalid props in a Frame)

### 4. Dynamic HTML Elements
Components can render different HTML elements based on props with union type support for dynamic HTML element rendering.

### 5. Icon Tree Shaking
Only used icons are imported and included in the final bundle for optimal performance.

### 6. Type Safety
Full TypeScript support with generated interfaces for all components, proper HTML element typing, union types for restricted props, and generic type parameters for flexibility.

## Usage

The React export system is used through the main factory export function or through individual functions for more granular control. The system requires a valid Seldon workspace with computed properties, export options specifying target framework and output paths, and component variants properly configured in workspace.

## Generated Output

The system produces a complete component library structure organized by component levels with primitives, elements, parts, modules, icons, utils, and assets. Each generated component includes TypeScript interfaces with fully typed props, React components with proper JSX structure, CSS classes with optimized styles, JSDoc comments for documentation, tree-shaken imports, and full theme integration support.

## Integration with Factory System

The React export system integrates seamlessly with the complete Factory system to ensure that all computed values are resolved before component generation, providing a complete and consistent design system.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Factory React Export System. When making changes to the React export functionality:

1. **Update this README first** to reflect the intended export behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the export pipeline** follows the documented workflow from workspace computation through file generation
4. **Ensure style override processing** maintains the documented class merging and cascade optimization
5. **Validate that component processing** follows the documented validation and rendering strategies

The React export system transforms valid Seldon workspaces through a structured pipeline that must maintain consistency with this documentation to ensure reliable component generation and proper style inheritance.

## Subsystem Documentation

For detailed implementation information, see the specific subsystem documentation:

- **[Technical Reference](./TECHNICAL.md)** - Code examples and implementation details
