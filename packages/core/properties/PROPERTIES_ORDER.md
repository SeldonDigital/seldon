# Properties Organization

This document defines the complete organization of properties in Seldon. It serves as the authoritative reference for:

- **Property Panel Order**: How properties appear in the Seldon Editor's property panel
- **Implementation Status**: Which properties are implemented vs. planned
- **Property Categories**: Logical grouping of related properties
- **Development Roadmap**: Future property additions and enhancements


## Property System Overview

The properties system is organized into 6 main sections that match the UI property panel structure. Each section contains related properties that work together to create cohesive design experiences.

## Property Panel Structure

### 1. Attributes Section ✅
Properties that are specific to the selected component type and define its core functionality.

#### Implemented Properties ✅
1. `content` - Text content for text-based components
2. `symbol` - Icon symbol for icon components
3. `htmlElement` - HTML element type (div, span, button, etc.)
4. `inputType` - Input type for form components (text, email, password, etc.)
5. `cursor` - Cursor type on hover (move to Pointer subsection in future)

### 2. Layout Section ✅
Properties that control the positioning, sizing, and spatial relationships of components.

#### Implemented Properties ✅
1. `direction` - Flex direction (row, column, row-reverse, column-reverse)
2. **Position** (subsection):
   - `position` - Position type (static, relative, absolute, fixed, sticky)
   - `position.top` - Top offset value
   - `position.right` - Right offset value  
   - `position.bottom` - Bottom offset value
   - `position.left` - Left offset value
3. `orientation` - Layout orientation (horizontal, vertical)
4. `align` - Alignment within container (start, center, end, stretch)
5. `cellAlign` - Table cell alignment (start, center, end, stretch, inherit)
6. `width` - Component width (dimension values, theme references)
7. `height` - Component height (dimension values, theme references)
8. `screenWidth` - Screen width for responsive design
9. `screenHeight` - Screen height for responsive design
10. **Margin** (subsection):
    - `margin` - All sides margin
    - `margin.top` - Top margin
    - `margin.right` - Right margin
    - `margin.bottom` - Bottom margin
    - `margin.left` - Left margin
11. **Padding** (subsection):
    - `padding` - All sides padding
    - `padding.top` - Top padding
    - `padding.right` - Right padding
    - `padding.bottom` - Bottom padding
    - `padding.left` - Left padding
12. `gap` - Space between child elements
13. `rotation` - Rotation angle in degrees
14. `wrapChildren` - Whether to wrap child elements
15. `clip` - Whether to clip overflowing content
16. `cursor` - Cursor type on hover (move to Pointer subsection in future)
17. `columns` - Number of columns (1-100) ✅ Enhanced with ColumnCountValue
18. `rows` - Number of rows (1-100) ✅ Enhanced with RowCountValue

#### Missing Properties ❌
- `zIndex` - Stacking order (integer, auto)
- `clipPath` - Clipping path (basic shapes, url)
- `minWidth`, `maxWidth` - Minimum/maximum width constraints
- `minHeight`, `maxHeight` - Minimum/maximum height constraints
- `outline` - Outline styling (width, style, color, offset)
- `grid` - CSS Grid system (template, auto, gap)
- `gridColumns` - Multi-column layout (count, width, gap, rule)


### 3. Appearance Section ✅
Properties that control the visual appearance and styling of components.

#### Implemented Properties ✅
1. `color` - Text/content color (theme references, exact colors)
2. `accentColor` - Accent color for highlights and emphasis
3. `brightness` - Brightness adjustment (percentage)
4. `opacity` - Transparency level (percentage)
5. **Background** (subsection):
   - `background.preset` - Theme background presets
   - `background.image` - Background image source
   - `background.position` - Image position (center, top, left, etc.)
   - `background.size` - Image size (cover, contain, exact dimensions)
   - `background.repeat` - Image repeat pattern (no-repeat, repeat, repeat-x, repeat-y)
   - `background.color` - Background color
   - `background.brightness` - Background brightness adjustment
   - `background.opacity` - Background transparency
6. **Border** (subsection):
   - `border.preset` - Theme border presets
   - `borderCollapse` - Table border collapse behavior
   - **All Sides**:
     - `border.style` - Border style (solid, dashed, dotted, none)
     - `border.color` - Border color
     - `border.width` - Border width
     - `border.brightness` - Border brightness adjustment
     - `border.opacity` - Border transparency
   - **Individual Sides** (Top, Right, Bottom, Left):
     - `border.topStyle`, `border.rightStyle`, etc. - Side-specific styles
     - `border.topColor`, `border.rightColor`, etc. - Side-specific colors
     - `border.topWidth`, `border.rightWidth`, etc. - Side-specific widths
     - `border.topBrightness`, `border.rightBrightness`, etc. - Side-specific brightness
     - `border.topOpacity`, `border.rightOpacity`, etc. - Side-specific opacity
7. **Corners** (subsection):
   - `corners` - All corners border radius
   - `corners.topLeft` - Top-left corner radius
   - `corners.topRight` - Top-right corner radius
   - `corners.bottomRight` - Bottom-right corner radius
   - `corners.bottomLeft` - Bottom-left corner radius

#### Missing Properties ❌
- `blendMode` - Color blending modes (normal, multiply, screen, overlay, etc.)
- `filter` - CSS filters (blur, brightness, contrast, grayscale, etc.)
- `backdropFilter` - Backdrop filters (same as filter but for background)


### 4. Typography Section ✅
Properties that control text styling, fonts, and typography.

#### Implemented Properties ✅
1. **Font** (subsection):
   - `font.preset` - Theme font presets (display, heading, body, etc.)
   - `font.family` - Font family (primary, secondary, custom)
   - `font.style` - Font style (normal, italic, oblique)
   - `font.weight` - Font weight (thin, light, normal, bold, black)
   - `font.size` - Font size (theme references, exact values)
   - `font.lineHeight` - Line height (tight, normal, relaxed)
2. `textAlign` - Text alignment (left, center, right, justify)
3. `letterSpacing` - Letter spacing (tight, normal, wide)
4. `textCase` - Text case transformation (none, uppercase, lowercase, capitalize)
5. `textDecoration` - Text decoration (none, underline, overline, line-through)
6. `wrapText` - Whether to wrap text content
7. `lines` - Number of lines to display (1-100) ✅ Enhanced with LineCountValue

#### Missing Properties ❌
- `textIndent` - Text indentation (length, percentage)
- `wordSpacing` - Word spacing (length, normal)
- `wordBreak` - Word breaking behavior (normal, break-all, keep-all, break-word)
- `lineBreak` - Line breaking behavior (auto, loose, normal, strict, anywhere)
- `hyphens` - Hyphenation control (none, manual, auto)


### 5. Gradients Section ✅
Properties that control gradient effects and color transitions.

#### Implemented Properties ✅
1. `gradient.preset` - Theme gradient presets
2. `gradient.angle` - Gradient angle in degrees
3. `gradient.startColor` - Starting color of gradient
4. `gradient.startBrightness` - Starting color brightness adjustment
5. `gradient.startOpacity` - Starting color opacity
6. `gradient.startPosition` - Starting color position (percentage)
7. `gradient.endColor` - Ending color of gradient
8. `gradient.endBrightness` - Ending color brightness adjustment
9. `gradient.endOpacity` - Ending color opacity
10. `gradient.endPosition` - Ending color position (percentage)
11. `gradient.gradientType` - Gradient type (linear, radial, conic)

#### Missing Properties ❌
- `multipleGradients` - Support for multiple gradient layers
- `multipleStops` - Support for multiple color stops in gradients


### 6. Effects Section ✅
Properties that control visual effects and interactions.

#### Implemented Properties ✅
1. **Shadow** (subsection):
   - `shadow.preset` - Theme shadow presets
   - `shadow.offsetX` - Horizontal shadow offset
   - `shadow.offsetY` - Vertical shadow offset
   - `shadow.blur` - Shadow blur radius
   - `shadow.color` - Shadow color
   - `shadow.brightness` - Shadow brightness adjustment
   - `shadow.opacity` - Shadow opacity
   - `shadow.spread` - Shadow spread radius
2. `scroll` - Scroll behavior (auto, hidden, scroll)
3. `scrollbarStyle` - Scrollbar styling (auto, hidden, overlay)

#### Missing Properties ❌
- `multipleShadows` - Support for multiple shadow layers
- `scrollSnap` - Scroll snap behavior (none, x, y, block, inline, both)
- `scrollSnapAlign` - Scroll snap alignment (none, start, end, center)
- `scrollSnapStop` - Scroll snap stop behavior (normal, always)
- `scrollPadding` - Scroll padding (length values)
- `scrollMargin` - Scroll margin (length values)


### 7. Future Sections 🔮

#### Behavior Section 🔮
Properties for component interactions and user behavior.

**Interactions** (subsection):
- `onClick` - Click event handlers
- `onHover` - Hover event handlers  
- `onFocus` - Focus event handlers
- `onActive` - Active state handlers
- `onDisabled` - Disabled state handlers

**Pointer** (subsection):
- `userSelect` - Text selection behavior
- `pointerEvents` - Pointer event handling

#### Motion Section 🔮
Properties for animations, transitions, and motion effects.

**Transition** (subsection):
- `transitionProperty` - CSS properties to transition
- `transitionDuration` - Transition duration
- `transitionTimingFunction` - Transition timing function
- `transitionDelay` - Transition delay

**Animation** (subsection):
- `animationName` - Animation name/keyframes
- `animationDuration` - Animation duration
- `animationTimingFunction` - Animation timing function
- `animationDelay` - Animation delay
- `animationIterationCount` - Number of iterations
- `animationDirection` - Animation direction
- `animationFillMode` - Animation fill mode
- `animationPlayState` - Animation play state

**Transform** (subsection):
- `transformTranslate` - Translation transforms
- `transformRotate` - Rotation transforms
- `transformScale` - Scale transforms
- `transformSkew` - Skew transforms
- `transformMatrix` - Matrix transforms
- `transformOrigin` - Transform origin point
- `transformStyle` - Transform style (flat, preserve-3d)

**Perspective** (subsection):
- `perspective` - 3D perspective distance
- `perspectiveOrigin` - Perspective origin point
- `backfaceVisibility` - Backface visibility

#### Data Section 🔮
Properties for data binding, validation, and loading states.

**Data Source** (subsection):
- `dataSource` - Data source configuration
- `dataFormat` - Data format specification
- `dataBinding` - Data binding configuration

**Validation** (subsection):
- `dataValidationRequired` - Required field validation
- `dataValidationPattern` - Pattern validation
- `dataValidationMin` - Minimum value validation
- `dataValidationMax` - Maximum value validation

**Loading States** (subsection):
- `dataLoadingLoading` - Loading state indicator
- `dataLoadingError` - Error state indicator
- `dataLoadingEmpty` - Empty state indicator

## Implementation Summary

### Current Status
- **✅ Implemented**: 42 properties across 6 main sections
- **❌ Missing**: 25+ properties planned for implementation
- **🔮 Future**: 30+ properties planned for future releases

### Key Enhancements Made
- **Type Safety**: Enhanced `columns`, `rows`, `lines`, and `source` properties with specific value types
- **Organization**: Properties organized to match UI property panel structure
- **Documentation**: Comprehensive property descriptions and implementation status
- **Roadmap**: Clear TODO stubs for missing and future properties

### Development Guidelines
- Properties are organized by UI panel sections for consistency
- Each property includes descriptive comments explaining its purpose
- Missing properties are clearly marked with TODO comments
- Future sections are planned but not yet implemented
- The property panel order is defined in `/services/editor/app/_components/properties-panel/config/section-definitions.ts`

## Notes

- The order is determined by the `standardSectionDefinitions` array in the section definitions file
- Component-specific properties appear first and are dynamically generated based on the selected component's schema
- Subsections are collapsible groups that contain related properties
- Only properties that exist on the selected component are displayed
- The property panel is rendered by the `PropertiesPane` component which uses the `getSections` helper function
