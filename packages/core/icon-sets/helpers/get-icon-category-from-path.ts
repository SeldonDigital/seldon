import {
  DEFAULT_CATEGORY_PATH,
  type IconCategory,
  IconCategoryPath,
  type IconSubcategory,
  categoryPaths,
} from "../categories"

/**
 * Extracts category path from a file path
 * Example: "material/user-interface/actions/IconMaterialAdd.tsx" → "user-interface/actions"
 * Example: "./user-interface/actions/IconMaterialAdd" → "user-interface/actions"
 */
export function getIconCategoryFromPath(filePath: string): IconCategoryPath {
  // Normalize path separators and remove leading/trailing slashes
  const normalized = filePath.replace(/\\/g, "/").replace(/^\.\//, "")

  // Extract category/subcategory from path
  // Pattern: {iconSet}/{category}/{subcategory}/...
  const parts = normalized.split("/").filter(Boolean)

  // Find the category and subcategory parts
  // They should be consecutive in the path
  for (let i = 0; i < parts.length - 1; i++) {
    const category = parts[i]
    const subcategory = parts[i + 1]
    const categoryPath = `${category}/${subcategory}` as IconCategoryPath

    // Validate against known category paths
    if (categoryPaths.includes(categoryPath)) {
      return categoryPath
    }
  }

  // If no valid category path found, return default
  return DEFAULT_CATEGORY_PATH
}

/**
 * Extracts category and subcategory from a category path
 * This is a utility function moved from categorize-icon.ts
 */
export function parseCategoryPath(path: IconCategoryPath): {
  category: IconCategory
  subcategory: IconSubcategory
} {
  const [category, subcategory] = path.split("/") as [
    IconCategory,
    IconSubcategory,
  ]
  return { category, subcategory }
}
