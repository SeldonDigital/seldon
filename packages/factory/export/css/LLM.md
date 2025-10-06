# CSS Export System - LLM Reference

## Quick Start for LLMs

**Core Purpose**: Transforms valid Seldon workspaces into production-ready CSS stylesheets with full theme support, component styling, and optimized class generation. It processes workspace styles, handles complex inheritance, and generates optimized CSS structures with proper cascade ordering.

**Key Features**:
- **Style Discovery**: Processes all workspace nodes to create CSS classes and mappings
- **CSS Generation**: Creates complete stylesheets with proper ordering and cascade
- **Theme Integration**: Comprehensive theme support with CSS custom properties
- **Class Optimization**: Intelligent deduplication and cascade ordering
- **High-DPI Support**: Responsive design with hairline variables

## Export Workflow (CRITICAL)

The system follows a sequential pipeline that processes workspace data into exportable CSS stylesheets:

1. **Style Discovery** - Identifies styles to export and creates style registry
2. **CSS Generation** - Generates CSS stylesheets, theme variables, and component styles
3. **Formatting** - Applies CSS formatting and optimization

## Main Export Process

### Export Function
```typescript
export async function exportCss(workspace: Workspace): Promise<string>
```

**Process Flow:**
1. **Style Registry Building**: Processes all nodes to create CSS classes and mappings
2. **Stylesheet Generation**: Creates complete CSS with proper ordering and cascade
3. **CSS Formatting**: Applies Prettier formatting for consistent style

### CSS Generation Pipeline

The CSS generation follows a structured approach:

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
1. **Reset Styles**: Comprehensive CSS reset for cross-browser consistency
2. **Base Styles**: Font size and hairline variables for responsive design
3. **Component Styles**: All component-specific styles with proper cascade ordering
4. **Theme Variables**: CSS custom properties for all used themes
5. **Formatting**: Prettier formatting for production-ready CSS

## Style Override Processing

The system processes style overrides through sophisticated CSS generation:

### 1. CSS Class Generation and Ordering
- Base component classes are generated first (e.g., `sdn-button`)
- Variant classes follow with proper depth-based ordering
- Shallower nodes override deeper ones via CSS cascade
- Classes are sorted alphabetically within the same depth level

### 2. CSS Cascade Optimization
- Base classes come before variant classes
- Depth-based ordering ensures proper override hierarchy
- Component-aware deduplication reduces bundle size
- Identical styles across components share classes

### 3. Class Deduplication
- Identical CSS classes are reused across components
- Component-aware deduplication within same component type
- Memory optimization reduces CSS bundle size
- Maintains proper cascade ordering

## Data Structures

### Style Registry
```typescript
type Classes = { [className: string]: CSSObject }
type NodeIdToClass = Record<string, string>

interface StyleRegistry {
  classes: Classes
  nodeIdToClass: NodeIdToClass
  classNameToNodeId: Record<string, string>
  nodeTreeDepths: Record<string, number>
}
```

### CSS Generation Functions
```typescript
// Main stylesheet generation
export async function generateStylesheet(
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
): Promise<string>

// Style insertion functions
export function insertResetStyles(stylesheet: string): string
export function insertBaseStyles(stylesheet: string): string
export function insertNodeStyles(
  stylesheet: string,
  classes: Classes,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
): string
export function insertThemeVariables(stylesheet: string, workspace: Workspace): string
```

## Style Discovery Process

### Style Registry Building
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

### Class Name Generation
```typescript
export const getClassNameForNodeId = (nodeId: InstanceId | VariantId): string
```

**Process:**
- Removes "child-" and "variant-" prefixes
- Removes "-default" suffix
- Adds "sdn-" prefix for consistent naming

## CSS Generation Components

### Reset Styles
- Comprehensive CSS reset styles
- Handles box-sizing, margins, padding, and form elements
- Ensures consistent cross-browser styling

### Base Styles
- Base font size (16px)
- Hairline variable for high-DPI displays
- Responsive hairline adjustments for 2x, 3x, and 4x pixel ratios

### Component Styles
- Styles for all workspace components
- Intelligent CSS cascade ordering:
  - Base classes first (e.g., "sdn-button")
  - Variant classes by tree depth (shallower first)
  - Alphabetical ordering within same depth
- Ensures proper CSS specificity and cascade

### Theme Variables
- CSS custom properties for all used themes
- Theme-specific variable prefixes (--sdn-<themeid>-)
- Comprehensive token coverage:
  - Core values (ratio, font-size, size)
  - Font families (primary, secondary)
  - Color system (base color, harmony, swatches)
  - Size tokens (calculated using modulation)
  - Spacing tokens (margins, paddings, gaps)
  - Typography tokens (font sizes, weights, line heights)
  - Border and corner tokens

## Theme System Integration

The CSS export system provides comprehensive theme support:
- **Multi-theme Support**: Handles multiple themes in a single workspace
- **Semantic Naming**: Uses semantic swatch names instead of generic identifiers
- **Variable Prefixing**: Theme-specific CSS variable prefixes
- **Token Calculation**: Real-time calculation of size, spacing, and typography tokens

## High-DPI Support

Responsive design features:
- **Hairline Variables**: Dynamic hairline width for different pixel ratios
- **Media Query Integration**: Automatic responsive adjustments
- **Cross-device Compatibility**: Consistent appearance across devices

## Export Requirements

**Input Requirements:**
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

## LLM Guidelines

### ✅ DO
- Understand the style discovery process before CSS generation
- Use proper CSS cascade ordering (base classes first, then variants by depth)
- Handle class deduplication correctly within component types
- Generate proper theme variables with correct prefixes
- Apply depth-based ordering for proper CSS cascade
- Use the style registry for class name mapping
- Handle high-DPI support with hairline variables
- Format generated CSS with Prettier
- Process all workspace nodes for complete style coverage
- Maintain proper CSS specificity through ordering
- Generate comprehensive theme token coverage
- Handle cross-browser compatibility through reset styles

### ❌ DON'T
- Skip style discovery before CSS generation
- Ignore CSS cascade ordering requirements
- Mix base and variant classes incorrectly
- Skip class deduplication
- Generate invalid CSS syntax
- Ignore theme variable prefixing
- Skip depth-based ordering
- Mutate workspace objects directly
- Generate unformatted CSS
- Skip reset styles for cross-browser compatibility
- Ignore high-DPI support requirements
- Skip comprehensive theme token generation

## Common Patterns

**Style Registry Building**:
```typescript
const { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths } = 
  buildStyleRegistry(workspace)
```

**CSS Generation**:
```typescript
const stylesheet = await generateStylesheet(
  classes,
  workspace,
  classNameToNodeId,
  nodeTreeDepths,
)
```

**Class Name Generation**:
```typescript
const className = getClassNameForNodeId(nodeId)
```

**Style Insertion**:
```typescript
stylesheet = insertResetStyles(stylesheet)
stylesheet = insertBaseStyles(stylesheet)
stylesheet = insertNodeStyles(stylesheet, classes, classNameToNodeId, nodeTreeDepths)
stylesheet = insertThemeVariables(stylesheet, workspace)
stylesheet = await format(stylesheet)
```

## Quick Reference

**Core Imports**:
```typescript
import { exportCss } from '@seldon/factory/export/css'
import { buildStyleRegistry, generateStylesheet } from '@seldon/factory/export/css'
import { Classes, NodeIdToClass } from '@seldon/factory/export/css/types'
```

**Common Patterns**:
- Style registry: `buildStyleRegistry(workspace)`
- CSS generation: `generateStylesheet(classes, workspace, classNameToNodeId, nodeTreeDepths)`
- Class names: `sdn-<componentname>`, `sdn-<componentname>-<variantid>`
- Theme variables: `--sdn-<themeid>-<token>`
- Cascade ordering: base classes first, then variants by depth, then alphabetical
