# Factory CSS Export System - Technical Reference

This document provides comprehensive code examples and implementation details for the Factory CSS Export System.

## Style Discovery

### Style Registry Building

```typescript
import { buildStyleRegistry } from './discovery/get-style-registry'

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

### Class Name Generation

```typescript
import { getClassNameForNodeId } from './discovery/get-class-name'

export const getClassNameForNodeId = (nodeId: InstanceId | VariantId): string
```

**Process:**
- Removes "child-" and "variant-" prefixes
- Removes "-default" suffix
- Adds "sdn-" prefix for consistent naming

### Component ID Extraction

```typescript
import { getComponentIdFromClassName } from './discovery/get-component-id-from-class-name'

// Extracts component IDs from generated class names for deduplication logic
```

## CSS Generation

### Main Stylesheet Generation

```typescript
import { generateStylesheet } from './generation/generate-css-stylesheet'

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

### Style Insertion Functions

#### Reset Styles

```typescript
import { insertResetStyles } from './generation/insert-reset-styles'

// Inserts CSS reset styles
// Handles box-sizing, margins, padding, and form elements
// Ensures consistent cross-browser styling
```

#### Base Styles

```typescript
import { insertBaseStyles } from './generation/insert-base-styles'

// Inserts base font size (16px)
// Creates hairline variable for high-DPI displays
// Includes responsive hairline adjustments for 2x, 3x, and 4x pixel ratios
```

#### Component Styles

```typescript
import { insertNodeStyles } from './generation/insert-node-styles'

// Inserts styles for all workspace components
// Implements CSS cascade ordering:
//   - Base classes first (e.g., "sdn-button")
//   - Variant classes by tree depth (shallower first)
//   - Alphabetical ordering within same depth
// Ensures proper CSS specificity and cascade
```

#### Theme Variables

```typescript
import { insertThemeVariables } from './generation/insert-theme-variables'

// Generates CSS custom properties for all used themes
// Creates theme-specific variable prefixes (--sdn-<themeid>-)
// Includes token coverage:
//   - Core values (ratio, font-size, size)
//   - Font families (primary, secondary)
//   - Color system (base color, harmony, swatches)
//   - Size tokens (calculated using modulation)
//   - Spacing tokens (margins, paddings, gaps)
//   - Typography tokens (font sizes, weights, line heights)
//   - Border and corner tokens
```

## Utilities

### CSS Formatting

```typescript
import { format } from './utils/format'

export async function format(content: string): Promise<string>
```

**Features:**
- **Prettier Integration**: Formats CSS with consistent style
- **Parser Configuration**: Uses CSS parser for proper formatting

## Main Export Process

### Export Function

```typescript
import { exportCss } from './export-css'

export async function exportCss(workspace: Workspace): Promise<string>
```

**Process Flow:**
1. **Style Registry Building**: Processes all nodes to create CSS classes and mappings
2. **Stylesheet Generation**: Creates complete CSS with proper ordering and cascade
3. **CSS Formatting**: Applies Prettier formatting for consistent style

### CSS Generation Pipeline

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

## Usage Examples

### Main Export Function

```typescript
import { exportCss } from '@seldon/factory/export/css'

const stylesheet = await exportCss(workspace)
```

### Individual Functions

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

### Complete Factory Integration

```typescript
import { exportWorkspace } from '@seldon/factory'

const files = await exportWorkspace(workspace, {
  rootDirectory: './my-app',
  target: { 
    framework: 'react', 
    styles: 'css-properties' 
  },
  output: {
    componentsFolder: '/src/components',
    assetsFolder: '/public/assets',
    assetPublicPath: '/assets'
  }
})
```

## Generated Output

This generates a complete CSS stylesheet with:
**Reset Styles**: For consistent cross-browser behavior
**Base Styles**: With responsive design support
**Component-specific Styles**: With proper cascade ordering
**Theme Variables**: For comprehensive design token support
**Optimized Class Names**: And deduplication
**Production-ready, Formatted CSS**: Ready for deployment

### Generated CSS Example

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

The factory system handles property inheritance across component hierarchies:
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

### Style Registry Management

**Class Mapping**: Maps node IDs to CSS class names
**Deduplication**: Reuses identical CSS classes across components
**Tree Depth Calculation**: Enables proper CSS cascade ordering
**Variant Mapping**: Child instances map to their variant's classes

### CSS Optimization

**Shorthand Properties**: Generates optimized CSS with shorthand properties
**Undefined Value Removal**: Removes undefined values and empty properties
**Specificity Management**: Proper CSS specificity handling
**Cascade Ordering**: Intelligent CSS ordering for proper cascade

## Advanced Features

### 1. Theme System Integration
The CSS export system provides comprehensive theme support:
**Multi-theme Support**: Handles multiple themes in a single workspace
**Semantic Naming**: Uses semantic swatch names instead of generic identifiers
**Variable Prefixing**: Theme-specific CSS variable prefixes
**Token Calculation**: Real-time calculation of size, spacing, and typography tokens

**Theme Variable Structure:**
```css
:root {
  /* Core theme values */
  --sdn-theme-primary-ratio: 1.5;
  --sdn-theme-primary-font-size: 16px;
  --sdn-theme-primary-base-color: #3b82f6;
  
  /* Calculated tokens */
  --sdn-theme-primary-size-sm: 8px;
  --sdn-theme-primary-size-md: 12px;
  --sdn-theme-primary-size-lg: 18px;
  
  /* Color harmony */
  --sdn-theme-primary-color-primary: #3b82f6;
  --sdn-theme-primary-color-secondary: #64748b;
  --sdn-theme-primary-color-accent: #f59e0b;
}
```

### 2. CSS Cascade Optimization
Intelligent CSS ordering ensures proper cascade:
**Base Classes First**: Component base classes come before variants
**Depth-based Ordering**: Shallower nodes override deeper ones
**Alphabetical Consistency**: Predictable ordering within same depth
**Specificity Management**: Proper CSS specificity handling

**CSS Ordering Example:**
```css
/* Base classes first */
.sdn-button { /* base styles */ }

/* Variant classes by tree depth (shallower first) */
.sdn-button-primary { /* variant styles */ }
.sdn-button-secondary { /* variant styles */ }

/* Alphabetical ordering within same depth */
.sdn-button-large { /* size variant */ }
.sdn-button-small { /* size variant */ }
```

### 3. Class Deduplication
Efficient class management:
**Identical CSS Reuse**: Same styles across components share classes
**Component-aware Deduplication**: Only deduplicates within same component type
**Memory Optimization**: Reduces CSS bundle size

### 4. High-DPI Support
Responsive design features:

**Hairline Variables**: Dynamic hairline width for different pixel ratios
**Media Query Integration**: Automatic responsive adjustments
**Cross-device Compatibility**: Consistent appearance across devices

**High-DPI CSS Example:**
```css
/* Hairline variables for high-DPI displays */
:root {
  --sdn-hairline: 0.5px;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  :root {
    --sdn-hairline: 0.5px;
  }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
  :root {
    --sdn-hairline: 0.33px;
  }
}
```

## Integration with Factory System

The CSS export system integrates seamlessly with the complete Factory system:
```typescript
import { computeWorkspace } from '@seldon/core/helpers'
import { exportWorkspace } from '@seldon/factory'

const computedWorkspace = computeWorkspace(workspace)
const files = await exportWorkspace(computedWorkspace, options)
```

This ensures that all computed values are resolved before CSS generation, providing a complete and consistent design system.

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

## Best Practices
1. **Use theme values** for design system consistency
2. **Prefer compound properties** for complex styling
3. **Validate properties** before processing
4. **Use type guards** for runtime type checking
5. **Leverage property merging** for inheritance
6. **Handle empty values** appropriately
7. **Use computed properties** for dynamic calculations
8. **Follow naming conventions** for property keys

## Error Handling
The CSS export system includes comprehensive error handling:
- **TypeScript compilation errors** for invalid property structures
- **Runtime validation** for theme value resolution
- **Graceful fallbacks** for missing theme values
- **Clear error messages** for invalid property values

## Performance Considerations
1. **Theme Caching** - Cache computed themes to avoid recalculation
2. **Lazy Loading** - Load themes only when needed
3. **Color Precomputation** - Precompute color palettes
4. **Memory Management** - Clean up unused theme instances
