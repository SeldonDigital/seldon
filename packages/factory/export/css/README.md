# CSS Export System

The CSS export system transforms valid Seldon workspaces into production-ready CSS stylesheets with theme support, component styling, and optimized class generation. It processes workspace styles, handles inheritance, and generates optimized CSS structures with proper cascade ordering.

## Export Workflow

The system follows a pipeline that processes workspace data into exportable CSS stylesheets:

1. **Style Discovery** - Identifies styles to export and creates style registry
2. **CSS Generation** - Generates CSS stylesheets, theme variables, and component styles
3. **Formatting** - Applies CSS formatting and optimization


## Processing Stages

### 1. Style Discovery (`discovery/`)

#### Style Registry Building (`discovery/get-style-registry.ts`)

The core function that builds the style registry from a workspace:

```typescript
export const buildStyleRegistry = (
  workspace: Workspace,
): {
  classes: Classes
  nodeIdToClass: NodeIdToClass
  classNameToNodeId: Record<string, string>
  nodeTreeDepths: Record<string, number>
}
```

**Process:**
- Processes all nodes in the workspace to create CSS classes
- Handles default variant property merging with schema properties
- Implements child node property inheritance
- Deduplicates identical CSS classes across components
- Maps child nodes to their variant's classes when appropriate
- Calculates tree depths for proper CSS cascade ordering

**Features:**
- **Property Inheritance**: Child nodes inherit styling from parent instances
- **Class Deduplication**: Identical CSS classes are reused across components
- **Tree Depth Calculation**: Enables proper CSS cascade ordering
- **Variant Mapping**: Child instances map to their variant's classes

#### Class Name Generation (`discovery/get-class-name.ts`)

Generates consistent CSS class names from node IDs:

```typescript
export const getClassNameForNodeId = (nodeId: InstanceId | VariantId): string
```

**Process:**
- Removes "child-" and "variant-" prefixes
- Removes "-default" suffix
- Adds "sdn-" prefix for consistent naming

#### Component ID Extraction (`discovery/get-component-id-from-class-name.ts`)

Extracts component IDs from generated class names for deduplication logic.

### 2. CSS Generation (`generation/`)

#### Main Stylesheet Generation (`generation/generate-css-stylesheet.ts`)

The main orchestration function that coordinates the CSS generation process:

```typescript
export async function generateStylesheet(
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
): Promise<string>
```

**Process Flow:**
1. **Reset Styles**: Inserts CSS reset styles
2. **Base Styles**: Inserts base font size and hairline variables
3. **Component Styles**: Inserts all component-specific styles
4. **Theme Variables**: Inserts CSS custom properties for themes
5. **Formatting**: Formats the final CSS with Prettier

#### Style Insertion Functions

**Reset Styles** (`generation/insert-reset-styles.ts`)
- Inserts CSS reset styles
- Handles box-sizing, margins, padding, and form elements
- Ensures consistent cross-browser styling

**Base Styles** (`generation/insert-base-styles.ts`)
- Inserts base font size (16px)
- Creates hairline variable for high-DPI displays
- Includes responsive hairline adjustments for 2x, 3x, and 4x pixel ratios

**Component Styles** (`generation/insert-node-styles.ts`)
- Inserts styles for all workspace components
- Implements CSS cascade ordering:
  - Base classes first (e.g., "sdn-button")
  - Variant classes by tree depth (shallower first)
  - Alphabetical ordering within same depth
- Ensures proper CSS specificity and cascade

**Theme Variables** (`generation/insert-theme-variables.ts`)
- Generates CSS custom properties for all used themes
- Creates theme-specific variable prefixes (--sdn-<themeid>-)
- Includes token coverage:
  - Core values (ratio, font-size, size)
  - Font families (primary, secondary)
  - Color system (base color, harmony, swatches)
  - Size tokens (calculated using modulation)
  - Spacing tokens (margins, paddings, gaps)
  - Typography tokens (font sizes, weights, line heights)
  - Border and corner tokens

### 3. Utilities (`utils/`)

#### CSS Formatting (`utils/format.ts`)

Handles CSS code formatting with Prettier:

```typescript
export async function format(content: string): Promise<string>
```

**Features:**
- **Prettier Integration**: Formats CSS with consistent style
- **Parser Configuration**: Uses CSS parser for proper formatting

## Main Export Process

### Export Function (`export-css.ts`)

The main orchestration function that coordinates the CSS export process:

```typescript
export async function exportCss(workspace: Workspace): Promise<string>
```

**Process Flow:**
1. **Style Registry Building**: Processes all nodes to create CSS classes and mappings
2. **Stylesheet Generation**: Creates complete CSS with proper ordering and cascade
3. **CSS Formatting**: Applies Prettier formatting for consistent style

### CSS Generation Pipeline

The CSS generation follows an approach:

```typescript
// 1. Reset styles
stylesheet = insertResetStyles(stylesheet)

// 2. Base styles  
stylesheet = insertBaseStyles(stylesheet)

// 3. Component styles
stylesheet = insertNodeStyles(stylesheet, classes, classNameToNodeId, nodeTreeDepths)

// 4. Theme variables
stylesheet = insertThemeVariables(stylesheet, workspace)

// 5. Formatting
stylesheet = await format(stylesheet)
```

**Generation Order:**
1. **Reset Styles**: CSS reset for cross-browser consistency
2. **Base Styles**: Font size and hairline variables for responsive design
3. **Component Styles**: All component-specific styles with proper cascade ordering
4. **Theme Variables**: CSS custom properties for all used themes
5. **Formatting**: Prettier formatting for production-ready CSS

## Key Features

### Style Override Processing

The system processes style overrides through CSS generation:

**1. CSS Class Generation and Ordering:**
- Base component classes are generated first (e.g., `sdn-button`)
- Variant classes follow with proper depth-based ordering
- Shallower nodes override deeper ones via CSS cascade
- Classes are sorted alphabetically within the same depth level

**2. CSS Cascade Optimization:**
- Base classes come before variant classes
- Depth-based ordering ensures proper override hierarchy
- Component-aware deduplication reduces bundle size
- Identical styles across components share classes

**3. Class Deduplication:**
- Identical CSS classes are reused across components
- Component-aware deduplication within same component type
- Memory optimization reduces CSS bundle size
- Maintains proper cascade ordering

### Theme System Integration

The CSS export system provides theme support:
- **Multi-theme Support**: Handles multiple themes in a single workspace
- **Semantic Naming**: Uses semantic swatch names instead of generic identifiers
- **Variable Prefixing**: Theme-specific CSS variable prefixes
- **Token Calculation**: Real-time calculation of size, spacing, and typography tokens

### High-DPI Support

Responsive design features:
- **Hairline Variables**: Dynamic hairline width for different pixel ratios
- **Media Query Integration**: Automatic responsive adjustments
- **Cross-device Compatibility**: Consistent appearance across devices

## Usage

The CSS export system is used through the main export function:

```typescript
import { exportCss } from '@seldon/factory/export/css'

const stylesheet = await exportCss(workspace)
```

Or through individual functions:

```typescript
import { buildStyleRegistry, generateStylesheet } from '@seldon/factory/export/css'

// Build style registry
const { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths } = 
  buildStyleRegistry(workspace)

// Generate stylesheet
const stylesheet = await generateStylesheet(
  classes,
  workspace,
  classNameToNodeId,
  nodeTreeDepths,
)
```

**Export Requirements:**
- Valid Seldon workspace with computed properties
- Workspace must contain component variants with styling
- Theme configuration must be properly set up

**Generated Output:**
- Reset styles for consistent cross-browser behavior
- Base styles with responsive design support
- Component-specific styles with proper cascade ordering
- Theme variables for comprehensive design token support
- Optimized class names and deduplication
- Production-ready, formatted CSS

## Usage as Source of Truth

This README serves as the documentation for the CSS Export System. When making changes to the CSS export functionality:

1. **Update this README first** to reflect the intended export behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the CSS generation pipeline** follows the documented workflow from style discovery through formatting
4. **Ensure style override processing** maintains the documented class generation and cascade optimization
5. **Validate that theme variable generation** follows the documented token calculation and variable prefixing

The CSS export system transforms valid Seldon workspaces through a pipeline that must maintain consistency with this documentation to ensure reliable stylesheet generation and proper style inheritance.
