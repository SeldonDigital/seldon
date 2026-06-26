/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 * 
 * You may not use this software, or any derivative works of it, in whole or in part, 
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) 
 * any machine learning or artificial intelligence system without written permission.
 * 
 *****/
 
# Seldon Components

This guide will help you understand how to use these components in your React application.

## Overview

Seldon components follow a consistent pattern that makes them easy to use and customize. Each component has:

- **Props interface**: Defines all available props with TypeScript types
- **Function signature**: Shows which props have defaults and which are conditional
- **Conditional rendering**: Some elements only render when explicitly provided
- **Slot suppression**: Pass `null` for any element prop to remove that element
- **Style integration**: Built-in CSS classes with customization options

## Component Structure

### Basic Usage

Every Seldon component can be used in these ways:

```tsx
// 1. Minimal rendering (every schema element renders with its defaults)
<CardProduct />

// 2. Partial customization (override specific content elements)
<CardProduct 
  textTagline={{ children: "New Product" }}
  textTitle={{ children: "Custom Title" }}
/>

// 3. Full customization (override content, wire up actions, remove elements)
<CardProduct
  textTagline={{ children: "Featured", className: "custom-tagline" }}
  textTitle={{ children: "Premium Product" }}
  description={{ children: "Product description here" }}
  button={{ onClick: () => alert("Clicked!") }}
  icon={{ icon: "material-star" }}
  textLabel={{ children: "Buy Now" }}
  button2={null}  // remove the second action button
/>
```

### Understanding Conditional vs Always-Rendered Elements

Components have two types of elements:

#### Schema Elements
These elements come from the component's schema. They have default values and render by default. Pass `null` to remove one:

```tsx
// Every schema element renders because it has a default in the function signature
<CardProduct />  // frame, textTagline, textTitle, description, and bar all render

<CardProduct 
  textTagline={{ children: "Custom tagline" }}  // Will render with custom content
  bar={null}                                    // Suppressed: the action bar will not render
/>
```

#### Inline Extras
These elements were added in the workspace outside the component's schema. They have no default and only appear when you pass their prop:

```tsx
// An extra fourth button was added to this card's bar in the workspace
<CardProduct
  button4={{ onClick: () => alert("Extra action!") }}  // Will render
  icon4={{ icon: "material-favorite" }}
  // Omit button4 entirely and the extra button does not render
/>
```

**Key Rule**: Elements without defaults in the function signature render only when you pass their prop. The render guard is a truthy check, so even an empty object (`button4={{}}`) renders the element with its default content. To skip an element, omit its prop entirely. Elements with defaults render unless you pass `null` for their prop.

## Function Signatures Guide

The function signature tells you which props are schema elements and which are inline extras:

```tsx
export function CardProduct({
  frame = sdn.frame,              // ✅ Rendered by default (pass null to remove)
  textTagline = sdn.textTagline,  // ✅ Rendered by default (pass null to remove)
  textTitle = sdn.textTitle,      // ✅ Rendered by default (pass null to remove)
  description = sdn.description,  // ✅ Rendered by default (pass null to remove)
  bar = sdn.bar,                  // ✅ Rendered by default (pass null to remove)
  button = sdn.button,            // ✅ Rendered by default (pass null to remove)
  button4,                        // ⚠️  Inline extra (renders only when passed)
  // ...
}: CardProductProps)
```

**Key Pattern**: Elements with `= sdn.something` have defaults and render unless you pass `null`. Elements without defaults are inline extras and render only when you pass their prop.

## Common Patterns

### 1. Customizing Text Content

```tsx
<CardProduct 
  textTagline={{ children: "Limited Time Offer" }}
  textTitle={{ children: "Premium Headphones" }}
  description={{ children: "High-quality audio experience." }}
/>
```

### 2. Adding Interactive Elements

```tsx
<CardProduct
  button={{ onClick: () => window.open("/product/123") }}
  icon={{ icon: "material-shoppingCart" }}
  textLabel={{ children: "Add to Cart" }}
  button2={{ onClick: () => setFavorite(true) }}
  icon2={{ icon: "material-favorite" }}
  textLabel2={{ children: "Save" }}
  textTagline={{ children: "Featured Product" }}
  textTitle={{ children: "Product Name" }}
/>
```

### 3. Custom Styling

```tsx
<CardProduct
  className="my-custom-card"
  textTagline={{ 
    children: "New Release",
    className: "highlight-text"
  }}
  style={{ 
    maxWidth: 400,
    margin: "20px auto"
  }}
/>
```

### 4. Conditional Features

Use `null` to remove schema elements based on state. Use spreads to pass inline extras conditionally:

```tsx
function ProductCard({ showActions, isLoggedIn }) {
  return (
    <CardProduct
      textTagline={{ children: "Featured Product" }}
      textTitle={{ children: "Product Name" }}
      
      {/* Remove the whole action bar when actions are disabled */}
      bar={showActions ? undefined : null}
      
      {/* Pass the extra favorite button only when logged in */}
      {...(isLoggedIn && {
        button4: { onClick: () => toggleFavorite() },
        icon4: { icon: "material-favorite" }
      })}
    />
  )
}
```

## Icon System

Seldon components use Material Icons by default. Common icons include:

- `material-add` - Plus sign
- `material-favorite` - Heart
- `material-shoppingCart` - Shopping cart
- `material-arrowForward` - Right arrow
- `material-star` - Star
- `material-check` - Checkmark

```tsx
<CardProduct 
  icon={{ icon: "material-star" }}
  icon2={{ icon: "material-favorite" }}
  icon3={{ icon: "material-shoppingCart" }}
/>
```

## Styling Integration

### CSS Classes

Every component includes CSS classes for styling:

```css
/* Base component styles (default variant) */
.sdn-card-product { /* Base card styles */ }
.sdn-button { /* Base button styles */ }
.sdn-text-tagline { /* Base tagline text styles */ }

/* Named variant styles */
.sdn-button-iconic { /* A "iconic" button variant */ }

/* Instance styles (variant class + -- + short hash) */
.sdn-button-iconic--abc12 { /* A specific button instance */ }
.sdn-text-title--njjv0 { /* A specific title text instance */ }
```

### Custom Styling

You can override styles in several ways:

```tsx
// 1. Component-level className
<CardProduct className="my-custom-card" />

// 2. Element-level className  
<CardProduct 
  textTagline={{ 
    children: "Featured",
    className: "featured-tag"
  }}
/>

// 3. Inline styles
<CardProduct 
  style={{ backgroundColor: "#f0f0f0" }}
  textTagline={{
    children: "Special",
    style: { color: "red", fontWeight: "bold" }
  }}
/>

// 4. Using theme variables for consistent styling
<CardProduct 
  style={{ 
    backgroundColor: "hsl(var(--sdn-swatch-background))",
    border: "1px solid hsl(var(--sdn-swatch-primary))"
  }}
  textTagline={{
    children: "Themed Content",
    style: { 
      color: "hsl(var(--sdn-swatch-punch))",
      fontSize: "var(--sdn-font-size-medium)"
    }
  }}
/>
```

#### Design Tokens via Theme Variables

The exported stylesheets include CSS design tokens (theme variables) that you can use for consistent theming across your application. This can be useful for integrating Seldon components with existing components.

The default `seldon` theme uses bare `--sdn-` variables and ships as `styles-seldon.css`. Every other theme uses a `--sdn-{slug}-` prefix and ships as `styles-{slug}.css`, for example `--sdn-seldon-red-swatch-primary` in `styles-seldon-red.css`:

```css
/* Available theme variables include: */
:root {
  /* Colors */
  --sdn-swatch-background: /* Dynamic background color */
  --sdn-swatch-primary: /* Primary brand color */
  --sdn-swatch-punch: /* Custom brand colors, named by their theme labels */
  --sdn-swatch-positive: /* Custom brand colors, named by their theme labels */
  --sdn-swatch-tint-1: /* Harmony-based palette colors */
  
  /* Typography */
  --sdn-font-size-small: /* Consistent font sizes */
  --sdn-font-size-medium: /* Consistent font sizes */
  --sdn-font-family-primary: /* Brand typography */
  
  /* Spacing */
  --sdn-margin-tight: /* Consistent spacing */
  --sdn-padding-cozy: /* Consistent spacing */
  --sdn-gap-comfortable: /* Consistent spacing */
}
```

```tsx
// Use theme variables in your existing components for consistency
function MyExistingButton({ children, ...props }) {
  return (
    <button 
      style={{
        backgroundColor: "hsl(var(--sdn-swatch-primary))",
        color: "hsl(var(--sdn-swatch-background))",
        fontSize: "var(--sdn-font-size-medium)",
        padding: "var(--sdn-padding-cozy)",
        fontFamily: "var(--sdn-font-family-primary)"
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// Your existing components will now match Seldon component styling
<div>
  <CardProduct textTagline={{ children: "Seldon Card" }} />
  <MyExistingButton>Matching Button</MyExistingButton>
</div>
```

**Benefits of using theme variables:**
- Consistent visual design across all components
- Automatic updates when themes change
- Easy integration with existing component libraries
- Responsive design support with dynamic color harmonies

## TypeScript Support

All components are fully typed. Each component and its props interface are exported from their own file under the matching level folder (for example `elements/Button.tsx`, `parts/CardProduct.tsx`). Import them by path:

```tsx
import { CardProduct, CardProductProps } from './parts/CardProduct'
import { ButtonProps } from './elements/Button'

function CustomProduct(props: CardProductProps) {
  const buttonConfig: ButtonProps = {
    onClick: () => alert("Custom action!"),
    className: "custom-button"
  }
  
  return <CardProduct {...props} button={buttonConfig} />
}
```

## Best Practices

### 1. Start Simple
Begin with minimal props and gradually add customizations:

```tsx
// Start with this (every schema element renders with its defaults)
<CardProduct />

// Then add content
<CardProduct 
  textTagline={{ children: "My Product" }}
  textTitle={{ children: "Custom Title" }}
/>

// Finally, full customization
<CardProduct 
  textTagline={{ children: "My Product" }}
  textTitle={{ children: "Custom Title" }}
  button={{ onClick: handleClick }}
  icon={{ icon: "material-star" }}
  textLabel={{ children: "Buy Now" }}
/>
```

### 2. Remove Elements With null, Skip Extras By Omission
Pass `null` to remove a schema element. Omit an inline extra's prop to skip it:

```tsx
// ❌ Don't do this (empty objects still render the element with default content)
<CardProduct button4={{}} />

// ✅ Do this (remove schema elements with null, pass extras with meaningful content)
<CardProduct 
  button2={null}
  button4={{ onClick: handleAction }}
  icon4={{ icon: "material-star" }}
/>
```

### 3. Leverage Container Defaults
Take advantage of the containers that render by default (frame, bar):

```tsx
// This gets you the full layout structure with custom content
<CardProduct 
  textTagline={{ children: "My Custom Title" }}
  description={{ children: "My description" }}
/>
```

### 4. Maintain Accessibility
Always provide meaningful labels and ARIA attributes:

```tsx
<CardProduct 
  button={{ 
    onClick: handlePurchase,
    "aria-label": "Purchase this product",
    title: "Click to buy now"
  }}
  textLabel={{ children: "Buy Now" }}
/>
```

## Troubleshooting

### Elements Not Rendering
- Check if the element has a default value in the function signature (look for `= sdn.something`)
- Elements without defaults render only when you pass their prop; omit the prop to skip the element
- Elements with defaults render unless you pass `null` for their prop
- **Note**: the render guard for inline extras is a truthy check, so even `button4={{}}` renders the element with its default content
- For buttons, make sure to provide the button prop itself, plus icon and label if needed
- Verify that required nested props are included (e.g., `children` for labels, `icon` for icons)

### Styling Issues
- Import `styles.css` and each `styles-{slug}.css` file your workspace exports
- Check CSS class conflicts with your existing styles
- Use browser dev tools to inspect generated class names (instance classes end with a short hash like `sdn-button-iconic--abc12`)

### TypeScript Errors
- Ensure you're importing the correct prop interfaces
- Check that all required properties are provided
- Use optional chaining for nested props: `button?.onClick`
- Remember that an empty object `{}` is truthy, so it still renders the element; omit the prop to skip it

## Getting Help

Your exported components include:
- `Fonts.tsx` - Font loading component  
- `styles.css` - Reset, base, and component styles
- `styles-{slug}.css` - Theme token variables, one file per workspace theme
- Individual component files with full TypeScript definitions

For more information about Seldon, visit [github.com/SeldonDigital/seldon](https://github.com/SeldonDigital/seldon)
