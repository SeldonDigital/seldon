/**
 * Shared keyword table for icon categorization.
 *
 * One ordered list maps name tokens to a category path. `getIconCategoryFromId`
 * uses it as the fallback for a vendor id not listed in the curated
 * `icon-categories.ts` source: the first keyword whose token appears in the id
 * wins, else {@link DEFAULT_CATEGORY_PATH}.
 *
 * Keep specific tokens above generic ones, because the first match wins.
 */
import { DEFAULT_CATEGORY_PATH } from "./categories"

import type { IconCategoryPath } from "./categories"

export interface CategoryKeyword {
  tokens: string[]
  path: IconCategoryPath
}

export const categoryKeywords: CategoryKeyword[] = [
  { tokens: ["arrow", "chevron", "expand", "unfold", "keyboard", "navigate", "menu"], path: "user-interface/navigation" },
  { tokens: ["align", "format", "text", "font", "title", "bold", "italic", "underline", "paragraph"], path: "user-interface/text" },
  { tokens: ["play", "pause", "stop", "volume", "video", "movie", "music", "audio", "camera", "photo", "image", "media", "mic"], path: "user-interface/media" },
  { tokens: ["mail", "email", "chat", "comment", "message", "call", "phone", "forum", "feedback", "notification"], path: "user-interface/communication" },
  { tokens: ["check", "error", "warning", "info", "done", "success", "alert", "status", "verified", "flag"], path: "user-interface/status" },
  { tokens: ["add", "remove", "delete", "edit", "save", "copy", "paste", "cut", "share", "download", "upload", "search", "settings", "refresh", "sync", "close", "cancel", "clear"], path: "user-interface/actions" },
  { tokens: ["wifi", "cloud", "network", "signal", "router", "bluetooth", "cast", "link", "vpn"], path: "system/connectivity" },
  { tokens: ["computer", "laptop", "tablet", "smartphone", "device", "tv", "watch", "keyboard", "mouse", "monitor", "desktop"], path: "system/devices" },
  { tokens: ["lock", "security", "shield", "key", "fingerprint", "password", "privacy", "admin"], path: "system/security" },
  { tokens: ["setting", "tune", "build", "wrench", "gear", "config", "toggle"], path: "system/settings" },
  { tokens: ["ai", "robot", "neural", "smart", "auto", "brain"], path: "system/ai" },
  { tokens: ["cart", "shop", "store", "payment", "money", "currency", "receipt", "tag", "sale", "bag", "card", "commerce"], path: "business/commerce" },
  { tokens: ["work", "business", "office", "briefcase", "corporate", "meeting", "chart", "analytics", "report", "dashboard"], path: "business/operations" },
  { tokens: ["file", "folder", "document", "archive", "attachment", "page", "note"], path: "content/files" },
  { tokens: ["data", "database", "storage", "table", "grid", "list", "server", "memory"], path: "content/data" },
  { tokens: ["location", "map", "place", "pin", "navigation", "compass", "gps", "direction", "route"], path: "utility/location" },
  { tokens: ["time", "clock", "calendar", "schedule", "event", "timer", "alarm", "date", "history"], path: "utility/time" },
  { tokens: ["car", "bus", "train", "bike", "flight", "airline", "transit", "taxi", "subway", "railway", "walk", "run"], path: "specialized/transportation" },
  { tokens: ["weather", "cloud", "rain", "snow", "sun", "storm", "wind", "temperature"], path: "specialized/weather" },
  { tokens: ["hospital", "health", "medical", "pharmacy", "fitness", "heart", "medicine"], path: "specialized/health" },
  { tokens: ["food", "restaurant", "coffee", "breakfast", "dining", "drink", "kitchen"], path: "specialized/food" },
  { tokens: ["sport", "game", "ball", "trophy", "fitness"], path: "specialized/sports" },
  { tokens: ["school", "education", "book", "learn", "class", "science", "lab"], path: "specialized/science" },
  { tokens: ["home", "house", "apartment", "hotel", "room", "household", "bed", "chair"], path: "specialized/household" },
  { tokens: ["facebook", "twitter", "instagram", "youtube", "linkedin", "github", "social", "reddit", "discord", "tiktok"], path: "social-media/social" },
  { tokens: ["person", "user", "account", "profile", "people", "group", "face"], path: "social-media/user" },
]

/**
 * Categorizes an icon id by the keyword table. Lowercases the id and returns the
 * first keyword whose token is a substring, else {@link DEFAULT_CATEGORY_PATH}.
 * Used as the fallback for a vendor id absent from the curated category source.
 */
export function matchCategoryKeyword(iconId: string): IconCategoryPath {
  const haystack = iconId.toLowerCase()

  for (const { tokens, path } of categoryKeywords) {
    if (tokens.some((token) => haystack.includes(token))) return path
  }

  return DEFAULT_CATEGORY_PATH
}
