/**
 * Icon Category Types
 *
 * Defines the hierarchical category structure for organizing icons across all icon sets.
 * Categories are organized into two levels: Category (level 1) and Subcategory (level 2).
 */

export type IconCategory =
  | "business"
  | "content"
  | "miscellaneous"
  | "social-media"
  | "specialized"
  | "system"
  | "user-interface"
  | "utility"

export type IconSubcategory =
  // business
  | "commerce"
  | "operations"
  // content
  | "data"
  | "files"
  // miscellaneous
  | "miscellaneous"
  // social-media
  | "social"
  | "user"
  // specialized
  | "education"
  | "entertainment"
  | "food"
  | "health"
  | "household"
  | "nature"
  | "science"
  | "sports"
  | "transportation"
  | "weather"
  // system
  | "devices"
  | "security"
  | "settings"
  // user-interface
  | "actions"
  | "communication"
  | "media"
  | "navigation"
  | "status"
  | "text"
  // utility
  | "location"
  | "time"

/**
 * Category path combining category and subcategory
 * Example: "user-interface/actions", "content/files"
 */
export type IconCategoryPath = `${IconCategory}/${IconSubcategory}`

/**
 * Mapping of categories to their subcategories
 */
export const categorySubcategories: Record<IconCategory, IconSubcategory[]> = {
  business: ["commerce", "operations"],
  content: ["data", "files"],
  miscellaneous: ["miscellaneous"],
  "social-media": ["social", "user"],
  specialized: [
    "education",
    "entertainment",
    "food",
    "health",
    "nature",
    "science",
    "transportation",
    "weather",
  ],
  system: ["devices", "security", "settings"],
  "user-interface": [
    "actions",
    "communication",
    "media",
    "navigation",
    "status",
    "text",
  ],
  utility: ["location", "time"],
}

/**
 * All valid category paths
 */
export const categoryPaths: IconCategoryPath[] = [
  "business/commerce",
  "business/operations",
  "content/data",
  "content/files",
  "miscellaneous/miscellaneous",
  "social-media/social",
  "social-media/user",
  "specialized/education",
  "specialized/entertainment",
  "specialized/food",
  "specialized/health",
  "specialized/household",
  "specialized/nature",
  "specialized/science",
  "specialized/sports",
  "specialized/transportation",
  "specialized/weather",
  "system/devices",
  "system/security",
  "system/settings",
  "user-interface/actions",
  "user-interface/communication",
  "user-interface/media",
  "user-interface/navigation",
  "user-interface/status",
  "user-interface/text",
  "utility/location",
  "utility/time",
]

/**
 * Default category for icons that can't be categorized
 */
export const DEFAULT_CATEGORY_PATH: IconCategoryPath =
  "miscellaneous/miscellaneous"

/**
 * All icon categories in order
 * Derived from categorySubcategories keys to ensure consistency
 */
export const iconCategories: readonly IconCategory[] = [
  "business",
  "content",
  "miscellaneous",
  "social-media",
  "specialized",
  "system",
  "user-interface",
  "utility",
] as const
