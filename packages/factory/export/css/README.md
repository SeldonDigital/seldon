# Factory CSS Export System

The Factory CSS Export System is a code generation engine that transforms Seldon design workspaces into production-ready CSS stylesheets with full theme support, component styling, and optimized class generation. It handles complex style inheritance, theme variables, and generates optimized CSS structures.

The CSS export system operates through a multi-stage pipeline that converts workspace data into complete CSS stylesheets. The system is organized into logical directories that reflect the pipeline stages:

1. **Style Discovery** (`discovery/`) - Identifies styles to export and creates style registry
2. **CSS Generation** (`generation/`) - Generates CSS stylesheets, theme variables, and component styles
3. **Utilities** (`utils/`) - Shared utility functions and helpers

## System Architecture

### Pipeline Stages

#### 1. Style Discovery (`discovery/`)

**Style Registry Building** (`discovery/get-style-registry.ts`)
The core function that builds the complete style registry from a workspace. Processes all nodes in the workspace to create CSS classes, handles default variant property merging with schema properties, implements child node property inheritance, deduplicates identical CSS classes across components, maps child nodes to their variant's classes when appropriate, and calculates tree depths for proper CSS cascade ordering.

**Class Name Generation** (`discovery/get-class-name.ts`)
Generates consistent CSS class names from node IDs by removing "child-" and "variant-" prefixes, removing "-default" suffix, and adding "sdn-" prefix for consistent naming.

**Component ID Extraction** (`discovery/get-component-id-from-class-name.ts`)
Extracts component IDs from generated class names for deduplication logic.

#### 2. CSS Generation (`generation/`)

**Main Stylesheet Generation** (`generation/generate-css-stylesheet.ts`)
The main orchestration function that coordinates the entire CSS generation process through a structured pipeline that inserts reset styles, base styles, component styles, theme variables, and applies formatting.

**Style Insertion Functions:**

**Reset Styles** (`generation/insert-reset-styles.ts`)
Inserts comprehensive CSS reset styles that handle box-sizing, margins, padding, and form elements to ensure consistent cross-browser styling.

**Base Styles** (`generation/insert-base-styles.ts`)
Inserts base font size (16px) and creates hairline variable for high-DPI displays with responsive hairline adjustments for 2x, 3x, and 4x pixel ratios.

**Component Styles** (`generation/insert-node-styles.ts`)
Inserts styles for all workspace components with intelligent CSS cascade ordering where base classes come first, variant classes follow by tree depth (shallower first), and alphabetical ordering within same depth ensures proper CSS specificity and cascade.

**Theme Variables** (`generation/insert-theme-variables.ts`)
Generates CSS custom properties for all used themes with theme-specific variable prefixes, comprehensive token coverage including core values, font families, color system, size tokens, spacing tokens, typography tokens, and border and corner tokens.

#### 3. Utilities (`utils/`)

**CSS Formatting** (`utils/format.ts`)
Handles CSS code formatting with Prettier integration using CSS parser for proper formatting.

## Advanced Features

#### 1. Theme System Integration
The CSS export system provides comprehensive theme support with multi-theme support that handles multiple themes in a single workspace, semantic naming that uses semantic swatch names instead of generic identifiers, variable prefixing with theme-specific CSS variable prefixes, and token calculation with real-time calculation of size, spacing, and typography tokens.

#### 2. CSS Cascade Optimization
Intelligent CSS ordering ensures proper cascade with base classes first, depth-based ordering where shallower nodes override deeper ones, alphabetical consistency for predictable ordering within same depth, and specificity management for proper CSS specificity handling.

#### 3. Class Deduplication
Efficient class management with identical CSS reuse where same styles across components share classes, component-aware deduplication that only deduplicates within same component type, and memory optimization that reduces CSS bundle size.

#### 4. High-DPI Support
Responsive design features with hairline variables that provide dynamic hairline width for different pixel ratios, media query integration with automatic responsive adjustments, and cross-device compatibility for consistent appearance across devices.

## Usage

The CSS export system is used through the main export function or through individual functions for more granular control. The system requires a valid Seldon workspace with computed properties, component variants with styling, and proper theme configuration.

## Generated Output

The system produces a complete CSS stylesheet with reset styles for consistent cross-browser behavior, base styles with responsive design support, component-specific styles with proper cascade ordering, theme variables for comprehensive design token support, optimized class names and deduplication, and production-ready, formatted CSS.

## Key Features

### Property Inheritance and Merging
The factory system handles property inheritance across component hierarchies with automatic inheritance from parent components, selective override capabilities, and complete property context building.

### Theme System Integration
Theme support with CSS custom properties and design tokens that flow through the component hierarchy, maintaining visual consistency across the entire design system.

### CSS Cascade Optimization
CSS ordering ensures proper cascade and specificity with intelligent class ordering, depth-based hierarchy, and optimized specificity management.

### Asset Optimization and Tree Shaking
Asset management with tree shaking that only includes assets actually used in the workspace, automatic image processing and format conversion, path transformation from absolute to relative export paths, and bundle optimization through efficient asset management.

### Responsive Design Support
Built-in responsive design features with media query integration, high-DPI support, and cross-device compatibility.

### Code Generation Optimization
Code generation with Prettier integration for automatic formatting, import sorting with custom import order, JSDoc generation for automatic documentation, and proper licensing headers for generated files.

## Integration with Factory System

The CSS export system integrates seamlessly with the complete Factory system to ensure that all computed values are resolved before CSS generation, providing a complete and consistent design system.

## Usage as Source of Truth

This README serves as the authoritative documentation for the Factory CSS Export System. When making changes to the CSS export functionality:

1. **Update this README first** to reflect the intended export behavior and processing workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Verify that the CSS generation pipeline** follows the documented workflow from style discovery through formatting
4. **Ensure style override processing** maintains the documented class generation and cascade optimization
5. **Validate that theme variable generation** follows the documented token calculation and variable prefixing

The CSS export system transforms valid Seldon workspaces through a structured pipeline that must maintain consistency with this documentation to ensure reliable stylesheet generation and proper style inheritance.

## Subsystem Documentation

For detailed implementation information, see the specific subsystem documentation:

- **[Technical Reference](./TECHNICAL.md)** - Code examples and implementation details
