# Editor Property Panel Order

This document outlines the exact order in which properties appear in the Seldon Editor's property panel. The order is defined in `/services/editor/app/_components/properties-panel/config/section-definitions.ts`.

## Property Panel Structure

### 1. Component-Specific Properties
Properties specific to the selected component (e.g., `content`, `display`, `ariaLabel`, etc.)


### 2. Layout Section
1. `direction`
2. **Position** (subsection):
   - `position`
   - `position.top`
   - `position.right`
   - `position.bottom`
   - `position.left`
3. `orientation`
4. `align`
5. `cellAlign`
6. `width`
7. `height`
8. `screenWidth`
9. `screenHeight`
10. **Margin** (subsection):
    - `margin`
    - `margin.top`
    - `margin.right`
    - `margin.bottom`
    - `margin.left`
11. **Padding** (subsection):
    - `padding`
    - `padding.top`
    - `padding.right`
    - `padding.bottom`
    - `padding.left`
12. `gap`
13. `rotation`
14. `wrapChildren`
15. `clip`
16. `cursor` (move to Pointer subsection)
17. `columns`
18. `rows`

**TODO:**
- `zIndex` (integer, auto)
- `clipPath` (basic shapes, url)
- `minWidth`, `maxWidth` (dimension values)
- `minHeight`, `maxHeight` (dimension values)
- `outline` (width, style, color, offset)
- `grid` (template, auto, gap) - Complete CSS Grid system
- `gridColumns` (count, width, gap, rule) - Multi-column layout


### 3. Appearance Section
1. `color`
2. `brightness`
3. `opacity`
4. **Background** (subsection):
   - `background.preset`
   - `background.image`
   - `background.position`
   - `background.size`
   - `background.repeat`
   - `background.color`
   - `background.brightness`
   - `background.opacity`
5. **Border** (subsection):
   - `border.preset`
   - `borderCollapse`
   - **All Sides**:
     - `border.style`
     - `border.color`
     - `border.width`
     - `border.brightness`
     - `border.opacity`
   - **Top**:
     - `border.topStyle`
     - `border.topColor`
     - `border.topWidth`
     - `border.topBrightness`
     - `border.topOpacity`
   - **Right**:
     - `border.rightStyle`
     - `border.rightColor`
     - `border.rightWidth`
     - `border.rightBrightness`
     - `border.rightOpacity`
   - **Bottom**:
     - `border.bottomStyle`
     - `border.bottomColor`
     - `border.bottomWidth`
     - `border.bottomBrightness`
     - `border.bottomOpacity`
   - **Left**:
     - `border.leftStyle`
     - `border.leftColor`
     - `border.leftWidth`
     - `border.leftOpacity`
6. **Corners** (subsection):
   - `corners`
   - `corners.topLeft`
   - `corners.topRight`
   - `corners.bottomRight`
   - `corners.bottomLeft`

**TODO:**
- `blendMode` (normal, multiply, screen, etc.)
- `filter` (blur, brightness, contrast, etc.)
- `backdropFilter` (same as filter)


### 4. Typography Section
1. **Font** (subsection):
   - `font.preset`
   - `font.family`
   - `font.style`
   - `font.weight`
   - `font.size`
   - `font.lineHeight`
2. `textAlign`
3. `letterSpacing`
4. `textCase`
5. `textDecoration`
6. `wrapText`
7. `lines`

**TODO:**
- `textIndent` (length, percentage)
- `wordSpacing` (length, normal)
- `wordBreak` (normal, break-all, keep-all, break-word)
- `lineBreak` (auto, loose, normal, strict, anywhere)
- `hyphens` (none, manual, auto)


### 5. Gradients Section
1. `gradient.preset`
2. `gradient.angle`
3. `gradient.startColor`
4. `gradient.startBrightness`
5. `gradient.startOpacity`
6. `gradient.startPosition`
7. `gradient.endColor`
8. `gradient.endBrightness`
9. `gradient.endOpacity`
10. `gradient.endPosition`
11. `gradient.gradientType`

**TODO:**
- multiple gradients
- multiple stops


### 6. Effects Section
1. **Shadow** (subsection):
   - `shadow.preset`
   - `shadow.offsetX`
   - `shadow.offsetY`
   - `shadow.blur`
   - `shadow.color`
   - `shadow.brightness`
   - `shadow.opacity`
   - `shadow.spread`

**TODO:**
- multiple shadows
- `scroll.snap` (none, x, y, block, inline, both)
- `scroll.snapAlign` (none, start, end, center)
- `scroll.snapStop` (normal, always)
- `scroll.padding` (length)
- `scroll.margin` (length)


### 7. TODO: Behavior Section
1. **Interactions** (subsection):
   - `onClick`
   - `onHover`
   - `onFocus`
   - `onActive`
   - `onDisabled`
3. **Pointer** (subsection):
   - `cursor`
   - `userSelect`
   - `pointerEvents`

### 8. TODO: Motion Section
1. **Transition** (subsection):
   - `transition.property`
   - `transition.duration`
   - `transition.timingFunction`
   - `transition.delay`
2. **Animation** (subsection):
   - `animation.name`
   - `animation.duration`
   - `animation.timingFunction`
   - `animation.delay`
   - `animation.iterationCount`
   - `animation.direction`
   - `animation.fillMode`
   - `animation.playState`
3. **Transform** (subsection):
   - `transform.translate`
   - `transform.rotate`
   - `transform.scale`
   - `transform.skew`
   - `transform.matrix`
   - `transform.origin`
   - `transform.style`
4. **Perspective** (subsection):
   - `perspective`
   - `perspective.origin`
   - `backfaceVisibility`


### 9. TODO: Data Section 
1. **Data Source** (subsection):
   - `dataSource`
   - `dataFormat`
   - `dataBinding`
2. **Validation** (subsection):
   - `dataValidation.required`
   - `dataValidation.pattern`
   - `dataValidation.min`
   - `dataValidation.max`
3. **Loading States** (subsection):
   - `dataLoading.loading`
   - `dataLoading.error`
   - `dataLoading.empty`


## Notes

- The order is determined by the `standardSectionDefinitions` array in the section definitions file
- Component-specific properties appear first and are dynamically generated based on the selected component's schema
- Subsections are collapsible groups that contain related properties
- Only properties that exist on the selected component are displayed
- The property panel is rendered by the `PropertiesPane` component which uses the `getSections` helper function
