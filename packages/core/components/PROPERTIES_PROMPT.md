# Automated Property Reordering

To ensure all component schemas follow the correct property order defined in this document, use the following systematic approach:

## Important Constraints

- **ONLY reorder existing properties** - do not add missing properties
- **DO NOT** change property values, types, or default values
- **DO NOT** modify section comments (// LAYOUT, // APPEARANCE, etc.)
- **DO NOT** change the structure of nested objects or arrays
- **DO NOT** remove or add empty lines between properties
- **DO NOT** change the indentation or formatting

## Complete Reordering Process

### 1. Component-Specific Properties Section
Keep all component-specific properties at the beginning of the properties object. Common properties include: `display`, `ariaLabel`, `ariaHidden`, `content`, `buttonSize`, etc. Maintain their relative order as they appear in the schema.

### 2. Layout Section Reordering
Ensure properties follow this exact order:

1. `direction`
2. `position`
3. `orientation`
4. `align`
5. `cellAlign`
6. `width`
7. `height`
8. `screenWidth`
9. `screenHeight`
10. `margin` (with sub-properties: top, right, bottom, left)
11. `padding` (with sub-properties: top, right, bottom, left)
12. `gap`
13. `rotation`
14. `wrapChildren`
15. `clip`
16. `cursor`
17. `columns`
18. `rows`

### 3. Appearance Section Reordering
Ensure properties follow this exact order:

1. `color`
2. `brightness`
3. `opacity`
4. `background` (with sub-properties in order):
   - `background.preset`
   - `background.image`
   - `background.position`
   - `background.size`
   - `background.repeat`
   - `background.color`
   - `background.brightness`
   - `background.opacity`
5. `border` (with sub-properties in order):
   - `border.preset`
   - `borderCollapse`
   - All sides properties: `style`, `color`, `width`, `brightness`, `opacity`
   - Top properties: `topStyle`, `topColor`, `topWidth`, `topBrightness`, `topOpacity`
   - Right properties: `rightStyle`, `rightColor`, `rightWidth`, `rightBrightness`, `rightOpacity`
   - Bottom properties: `bottomStyle`, `bottomColor`, `bottomWidth`, `bottomBrightness`, `bottomOpacity`
   - Left properties: `leftStyle`, `leftColor`, `leftWidth`, `leftOpacity`
6. `corners` (with sub-properties: `topLeft`, `topRight`, `bottomRight`, `bottomLeft`)

### 4. Typography Section Reordering
Ensure properties follow this exact order:

1. `font` (with sub-properties in order):
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

### 5. Gradients Section Reordering
Ensure properties follow this exact order:

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

### 6. Effects Section Reordering
Ensure properties follow this exact order:

1. `shadow` (with sub-properties in order):
   - `shadow.preset`
   - `shadow.offsetX`
   - `shadow.offsetY`
   - `shadow.blur`
   - `shadow.color`
   - `shadow.brightness`
   - `shadow.opacity`
   - `shadow.spread`

## Common Reordering Issues to Fix

### Layout Section Issues
- `position` property appears after `gap` or `rotation` → move to after `direction`
- `width` and `height` appear after `margin` and `padding` → move to before `margin`
- `screenHeight` appears before `screenWidth` → swap their positions
- `columns` and `rows` appear in separate "TABLEs" section → move to end of Layout section
- `cursor` appears before `clip` → move to after `clip`

### Appearance Section Issues
- `opacity` appears before `color` and `brightness` → move to after `brightness`
- `background` appears before `opacity` → move to after `opacity`
- `border` appears before `background` → move to after `background`
- `corners` appears before `border` → move to after `border`

### Typography Section Issues
- Properties appear in wrong order relative to each other
- `font` sub-properties appear in wrong order

### Gradients Section Issues
- Properties appear in wrong order relative to each other
- `gradient` sub-properties appear in wrong order

### Effects Section Issues
- `shadow` sub-properties appear in wrong order

## Validation Commands

```bash
# Check Layout section order
find packages/core/components -name "*.schema.ts" -exec grep -A 50 "// LAYOUT" {} \; | grep -E "^    [a-zA-Z]" | head -20

# Check for position property placement
find packages/core/components -name "*.schema.ts" -exec grep -l "^    position: {" {} \;

# Check for columns/rows placement
find packages/core/components -name "*.schema.ts" -exec grep -l "^    columns:" {} \;

# Check Appearance section order
find packages/core/components -name "*.schema.ts" -exec grep -A 20 "// APPEARANCE" {} \; | grep -E "^    [a-zA-Z]" | head -10

# Check Typography section order
find packages/core/components -name "*.schema.ts" -exec grep -A 20 "// TYPOGRAPHY" {} \; | grep -E "^    [a-zA-Z]" | head -10

# Check Gradients section order
find packages/core/components -name "*.schema.ts" -exec grep -A 20 "// GRADIENTS" {} \; | grep -E "^    [a-zA-Z]" | head -10

# Check Effects section order
find packages/core/components -name "*.schema.ts" -exec grep -A 20 "// EFFECTS" {} \; | grep -E "^    [a-zA-Z]" | head -10
```

## Systematic Approach

1. **Process by folder**: elements → frames/modules → parts → primitives → screens
2. **Check each section**: Component → Layout → Appearance → Typography → Gradients → Effects
3. **Verify sub-properties**: Ensure nested properties follow the correct order within their parent objects
4. **Test validation**: Use the validation commands to verify correct ordering
5. **Preserve intentional gaps**: Some properties are intentionally missing from certain schemas
