# Icon Categories Reference

This document provides a complete reference of all icon categories and subcategories. Icons are organized hierarchically into categories (level 1) and subcategories (level 2).

## Category Structure

Icons are organized using a two-level hierarchy: `{category}/{subcategory}`. For example:

- `user-interface/actions` - User interface icons for actions
- `content/files` - Content-related icons for files
- `business/commerce` - Business icons for commerce

---

### Business

Icons related to business operations, commerce, and transactions.

- **commerce** - E-commerce and shopping icons (cart, shopping, bag, credit, card, payment, tag, price, discount, gift, receipt, store, dollar, euro, pound, currency)
- **operations** - General business operations icons (briefcase, calculator, invoice, contract, business, office)

---

### Content

Icons related to content creation, management, and display.

- **data** - Data visualization and management (chart, graph, table, list, grid, database, analytics, etc.)
- **files** - File and folder icons (file, folder, document, archive, cloud, attachment, etc.)

---

### Miscellaneous

Icons that don't fit into other categories. This is a top-level category with no subcategories, used as the default fallback for uncategorized icons.

- **miscellaneous** - Icons that don't fit other categories (default fallback)

---

### Social-Media

Icons related to users, profiles, and social interactions.

- **social** - Social interaction icons (share, like, heart, star, bookmark, flag, follow, social)
- **user** - User and profile icons (user, users, profile, account, avatar, person, people, group, team)

---

### Specialized

Icons for specialized domains and use cases.

- **education** - Education and learning icons (book, graduation, school, learn, certificate, diploma, education, study)
- **entertainment** - Entertainment icons (music, film, game, controller, theater, concert, entertainment)
- **food** - Food and dining icons (coffee, restaurant, utensil, food, drink, wine, meal)
- **health** - Health and medical icons (heart, medical, cross, pill, hospital, stethoscope, thermometer, health, fitness)
- **household** - Household and home icons (house, furniture, appliances, rooms, building structures)
- **nature** - Nature and environment icons (tree, flower, leaf, animal, paw, mountain, nature)
- **science** - Science and technology icons (atom, flask, microscope, rocket, code, terminal, database, science, lab)
- **smart-home** - Smart home and IoT icons (thermostat, sensor, hub, camera, doorbell, automation, climate zone)
- **sports** - Sports and athletic icons (sports equipment, activities, games, athletics)
- **transportation** - Transportation and location icons (car, bus, train, airplane, bicycle, ship, map, location, pin, transport)
- **weather** - Weather icons (sun, cloud, rain, snow, wind, storm, temperature, weather)

---

### System

Icons related to system settings, security, devices, and connectivity.

- **ai** - AI and machine intelligence icons (assistant, model, agent, spark, automation, intelligence)
- **connectivity** - Network and signal icons (wifi, cellular, mobile data, signal bars, battery, bluetooth, network)
- **devices** - Device and hardware icons (computer, laptop, phone, tablet, printer, camera, monitor, server, device, hardware)
- **security** - Security and privacy icons (lock, unlock, shield, key, fingerprint, eye, privacy, secure, password)
- **settings** - Settings and configuration icons (settings, gear, cog, preferences, configuration, options, admin, tool, wrench)

---

### User-Interface

Icons for common, frequently-used actions and UI elements.

- **actions** - Action icons (add, remove, edit, save, delete, etc.)
- **communication** - Communication icons (email, message, chat, phone, notification, etc.)
- **media** - Media controls (play, pause, stop, volume, video, audio, etc.)
- **navigation** - Navigation icons (arrows, chevrons, menu, home, etc.)
- **status** - Status indicators (check, close, error, warning, info, success, loading, etc.)
- **text** - Text editing and formatting (text, bold, italic, underline, align, quote, code, etc.)

---

### Utility

Utility icons for time and location.

- **location** - Location and mapping icons (map, location, pin, marker, route, navigation, compass, gps)
- **time** - Time and calendar icons (clock, calendar, date, time, schedule, alarm, timer, watch)

---

## Category Paths

All valid category paths follow the pattern `{category}/{subcategory}`:

- `business/commerce`
- `business/operations`
- `content/data`
- `content/files`
- `miscellaneous/miscellaneous`
- `social-media/social`
- `social-media/user`
- `specialized/education`
- `specialized/entertainment`
- `specialized/food`
- `specialized/health`
- `specialized/household`
- `specialized/nature`
- `specialized/science`
- `specialized/smart-home`
- `specialized/sports`
- `specialized/transportation`
- `specialized/weather`
- `system/ai`
- `system/connectivity`
- `system/devices`
- `system/security`
- `system/settings`
- `user-interface/actions`
- `user-interface/communication`
- `user-interface/media`
- `user-interface/navigation`
- `user-interface/status`
- `user-interface/text`
- `utility/location`
- `utility/time`

---

## Default Category

When an icon cannot be categorized or its category cannot be determined, it defaults to:

- **`miscellaneous/miscellaneous`**

---

## File Organization

Icons are physically organized in the file system following this category structure:

```
packages/core/icon-sets/catalog/{iconSet}/{category}/{subcategory}/{IconFile}.tsx
```

For example:

- `packages/core/icon-sets/catalog/material/user-interface/actions/IconMaterialAdd.tsx`
- `packages/core/icon-sets/catalog/material/business/commerce/IconMaterialShoppingCart.tsx`
- `packages/core/icon-sets/catalog/material/user-interface/actions/IconMaterialSync.tsx`

The file location is the **source of truth** for an icon's category. Category information is extracted from the file path structure.

---

## Usage in Code

### Getting an Icon's Category

```typescript
import { IconId } from "@seldon/core/icon-sets"
import { getIconCategoryFromId } from "@seldon/core/icon-sets/helpers/get-icon-category-from-id"

const iconId: IconId = "material-add"
const categoryPath = getIconCategoryFromId(iconId)
// Returns: "user-interface/actions"
```

### Parsing Category Paths

```typescript
import { IconCategoryPath } from "@seldon/core/icon-sets/constants"
import { parseCategoryPath } from "@seldon/core/icon-sets/helpers/get-icon-category-from-path"

const categoryPath: IconCategoryPath = "user-interface/actions"
const { category, subcategory } = parseCategoryPath(categoryPath)
// Returns: { category: "user-interface", subcategory: "actions" }
```

### Validating Category Paths

```typescript
import {
  DEFAULT_CATEGORY_PATH,
  categoryPaths,
} from "@seldon/core/icon-sets/constants"

// Check if a path is valid
const isValid = categoryPaths.includes("user-interface/actions") // true

// Uncategorized icons fall back to DEFAULT_CATEGORY_PATH internally
const category = getIconCategoryFromId(unknownIconId)
```

---

## Notes for LLMs

When working with icon categories:

1. **File location is authoritative**: An icon's category is determined by its file path in `packages/core/icon-sets/catalog/{iconSet}/{category}/{subcategory}/`

2. **Category paths are fixed**: The list of valid categories and subcategories is fixed and defined in `packages/core/icon-sets/constants/categories.ts`. Do not create new categories without updating this file.

3. **Default fallback**: Icons that cannot be categorized default to `miscellaneous/miscellaneous`

4. **Case sensitivity**: Category and subcategory names are lowercase with hyphens (e.g., `social-media`, not `socialMedia` or `Social-Media`)

5. **Icon set independence**: Categories are shared across all icon sets (material, carbon, lucide, seldon)

6. **Static mapping**: Category mappings are stored per icon set in `packages/core/icon-sets/catalog/{iconSet}/category-map.ts` (e.g., `catalog/material/category-map.ts`, `catalog/carbon/category-map.ts`, `catalog/lucide/category-map.ts`, `catalog/seldon/category-map.ts`)
