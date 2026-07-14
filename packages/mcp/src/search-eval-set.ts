import type { SearchKind } from "./catalog-search"

/**
 * Authored eval set for the search quality gate: ≥40 query→expected
 * pairs (≥25 icons, ≥15 components). Hybrid recall@8 must be ≥90%; the
 * keyword-only floor is documented on the same set (SEARCH-EVAL.md).
 *
 * Authoring rules:
 * - Queries are written the way an agent mid-task would phrase them —
 *   concept-first paraphrases, not catalog vocabulary. Roughly half the icon
 *   queries deliberately avoid every word of the target's label, because the
 *   embedding layer exists precisely for those; the rest mix partial
 *   keyword overlap so the hybrid blend is tested, not just the semantic end.
 * - `expected` lists every catalog entry that would correctly serve the
 *   intent (the icon catalog has many near-duplicates across its four sets);
 *   a query scores a hit when ANY expected id lands in the top 8.
 * - Icon queries run with kind "icon" (agents inserting an icon filter to
 *   icons); component queries run unfiltered — cross-kind ranking is part of
 *   what the gate measures.
 *
 * Human authorship pass complete (2026-07-12): reviewed via
 * eval-review.html, which found the icon-tags-overrides.ts need and the
 * upstream Core icon-rendering bug (reported separately).
 */
export interface SearchEvalPair {
  query: string
  kind?: SearchKind
  /** A hit = any of these in the top 8. */
  expected: string[]
  /** Why this pair is in the set / what it exercises. */
  note?: string
}

export const SEARCH_EVAL_SET: SearchEvalPair[] = [
  // ---- Icons (≥25) -------------------------------------------------------
  {
    query: "garbage bin",
    kind: "icon",
    expected: [
      "carbon-trashCan",
      "lucide-trash",
      "lucide-trash_2",
      "material-delete",
      "material-deleteForever",
    ],
    note: "pure paraphrase — no label word overlap",
  },
  {
    query: "magnifying glass",
    kind: "icon",
    expected: [
      "carbon-search",
      "lucide-search",
      "material-search",
      "material-magnificationSmall",
      "material-magnificationLarge",
    ],
    note: "pure paraphrase",
  },
  {
    query: "cog wheel for preferences",
    kind: "icon",
    expected: [
      "carbon-settings",
      "lucide-settings_2",
      "material-settings",
      "lucide-cog",
      "carbon-gears",
    ],
    note: "pure paraphrase",
  },
  {
    query: "person silhouette for account",
    kind: "icon",
    expected: [
      "carbon-user",
      "carbon-person",
      "lucide-user",
      "material-person",
      "carbon-userAvatar",
    ],
  },
  {
    query: "little house for the start page",
    kind: "icon",
    expected: ["carbon-home", "lucide-house", "material-home"],
    note: "pure paraphrase",
  },
  {
    query: "caution triangle",
    kind: "icon",
    expected: [
      "carbon-warning",
      "carbon-warningAlt",
      "lucide-triangleAlert",
      "material-warning",
    ],
  },
  {
    query: "save file to disk arrow down",
    kind: "icon",
    expected: [
      "carbon-download",
      "lucide-download",
      "material-download",
      "material-fileSave",
      "lucide-fileDown",
    ],
  },
  {
    query: "send a file up to the server",
    kind: "icon",
    expected: [
      "carbon-upload",
      "lucide-upload",
      "material-upload",
      "material-uploadFile",
      "material-fileUpload",
      "lucide-fileUp",
    ],
  },
  {
    query: "pencil to modify text",
    kind: "icon",
    expected: ["carbon-edit", "lucide-pencil", "material-edit"],
    note: "synonym pair edit/pencil across sets",
  },
  {
    query: "x to dismiss",
    kind: "icon",
    expected: [
      "carbon-close",
      "carbon-closeLarge",
      "lucide-x",
      "material-close",
    ],
    note: "pure paraphrase",
  },
  {
    query: "tick mark done",
    kind: "icon",
    expected: [
      "carbon-checkmark",
      "lucide-check",
      "material-check",
      "material-done",
    ],
  },
  {
    query: "rating star",
    kind: "icon",
    expected: ["carbon-star", "carbon-starFilled", "material-star"],
  },
  {
    query: "heart shaped like button",
    kind: "icon",
    expected: [
      "carbon-favorite",
      "carbon-favoriteFilled",
      "material-favorite",
      "material-heartPlus",
      "lucide-heartPlus",
    ],
    note: "concept (like/favorite) vs literal shape (heart)",
  },
  {
    query: "padlock secure access",
    kind: "icon",
    expected: ["carbon-locked", "lucide-lock", "material-lock"],
  },
  {
    query: "envelope for messages",
    kind: "icon",
    expected: [
      "carbon-email",
      "lucide-mail",
      "material-email",
      "material-mail",
    ],
    note: "pure paraphrase",
  },
  {
    query: "telephone handset",
    kind: "icon",
    expected: [
      "carbon-phone",
      "lucide-phoneCall",
      "material-phone",
      "material-call",
    ],
  },
  {
    query: "month grid date picker",
    kind: "icon",
    expected: ["carbon-calendar", "lucide-calendar", "material-calendarMonth"],
  },
  {
    query: "take a photograph",
    kind: "icon",
    expected: ["carbon-camera", "material-camera", "material-photoCamera"],
  },
  {
    query: "basket for checkout",
    kind: "icon",
    expected: [
      "carbon-shoppingCart",
      "material-shoppingCart",
      "carbon-shoppingBag",
      "lucide-shoppingBasket",
    ],
    note: "pure paraphrase",
  },
  {
    query: "dollar sign payment",
    kind: "icon",
    expected: [
      "carbon-currencyDollar",
      "carbon-money",
      "material-attachMoney",
      "lucide-dollarSign",
      "material-paid",
    ],
  },
  {
    query: "bar graph statistics",
    kind: "icon",
    expected: ["carbon-chartBar", "lucide-chartBar", "material-barChart"],
  },
  {
    query: "triangle to start playback",
    kind: "icon",
    expected: [
      "carbon-play",
      "carbon-playFilled",
      "material-playArrow",
      "material-playCircle",
      "material-playCircleOutline",
    ],
    note: "pure paraphrase",
  },
  {
    query: "bell reminder",
    kind: "icon",
    expected: ["carbon-notification", "lucide-bell", "material-notifications"],
  },
  {
    query: "funnel to narrow results",
    kind: "icon",
    expected: ["carbon-filter", "material-filterAlt", "lucide-listFilter"],
  },
  {
    query: "map marker for an address",
    kind: "icon",
    expected: [
      "carbon-location",
      "carbon-locationFilled",
      "material-locationOn",
      "material-pinDrop",
      "lucide-mapPinHouse",
    ],
  },
  {
    query: "directory of files",
    kind: "icon",
    expected: ["carbon-folder", "material-folder"],
  },
  {
    query: "paperclip to attach",
    kind: "icon",
    expected: [
      "carbon-attachment",
      "material-attachFile",
      "material-attachment",
    ],
  },
  {
    query: "circular arrows try again",
    kind: "icon",
    expected: [
      "carbon-renew",
      "lucide-refreshCw",
      "lucide-refreshCcw",
      "material-refresh",
      "material-autorenew",
      "carbon-restart",
    ],
    note: "pure paraphrase",
  },
  {
    query: "sign out of the app",
    kind: "icon",
    expected: ["carbon-logout", "lucide-logOut", "material-logout"],
  },
  {
    query: "hamburger navigation",
    kind: "icon",
    expected: ["carbon-menu", "lucide-menu", "material-menu"],
    note: "hamburger≠food — classic paraphrase trap",
  },
  {
    query: "light bulb suggestion",
    kind: "icon",
    expected: ["carbon-idea", "lucide-lightbulb", "material-lightbulb"],
  },
  {
    query: "wall clock",
    kind: "icon",
    expected: [
      "carbon-time",
      "lucide-clock",
      "material-schedule",
      "material-accessTime",
    ],
  },
  {
    query: "printer hard copy",
    kind: "icon",
    expected: ["carbon-printer", "lucide-printer", "material-print"],
  },
  {
    query: "eyeball show password",
    kind: "icon",
    expected: ["carbon-view", "material-visibility"],
    note: "show/hide visibility concept",
  },

  // ---- Components (≥15) --------------------------------------------------
  {
    query: "clickable call to action",
    expected: ["button"],
    note: "covered today by the cta synonym — hybrid must not regress it",
  },
  {
    query: "user profile picture with initials",
    expected: ["avatar"],
  },
  {
    query: "modal overlay window",
    expected: ["dialog"],
    note: "covered today by the modal synonym",
  },
  {
    query: "top navigation with links",
    expected: ["nav", "bar"],
  },
  {
    query: "field where the user types text",
    expected: ["input"],
    note: "pure paraphrase",
  },
  {
    query: "dropdown to choose one option",
    expected: ["select", "combobox"],
  },
  {
    query: "subscription plan with features and price",
    expected: ["pricingCard"],
  },
  {
    query: "photograph placeholder",
    expected: ["image"],
  },
  {
    query: "thin horizontal line between sections",
    expected: ["hr"],
    note: "pure paraphrase (divider/separator synonyms exist for one-word forms)",
  },
  {
    query: "bottom of the page with legal links",
    expected: ["footer"],
    note: "pure paraphrase",
  },
  {
    query: "rows and columns of data",
    expected: ["table", "tableGrid"],
    note: "pure paraphrase",
  },
  {
    query: "checklist of tasks to complete",
    expected: ["widgetTodo"],
  },
  {
    query: "toast message that something happened",
    expected: ["notificationCard"],
  },
  {
    query: "dashboard KPI number tile",
    expected: ["statCard"],
  },
  {
    query: "ecommerce item with price and rating",
    expected: ["productCard"],
  },
  {
    query: "small pill shaped label",
    expected: ["chip"],
  },
  {
    query: "blog post preview with excerpt",
    expected: ["articleCard"],
  },
  {
    query: "quotation with a source",
    expected: ["blockquote", "cite"],
  },
  {
    query: "collapsible side panel",
    expected: ["sidebar"],
  },
  {
    query: "group of related form fields with a caption",
    expected: ["fieldset", "legend"],
  },

  // ---- Themes & font collections (extra coverage, beyond the gate minimums)
  {
    query: "accessible colors for low vision",
    kind: "theme",
    expected: ["highContrast"],
  },
  {
    query: "material design look",
    expected: ["googleMaterial"],
  },
  {
    query: "typefaces from google",
    expected: ["googleFonts"],
    note: "typeface→font synonym exists; 'from google' is word order the keyword scorer can't use",
  },
]
