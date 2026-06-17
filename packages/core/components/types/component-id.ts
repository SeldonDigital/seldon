/**
 * The component id union for the catalog. Each id matches a schema's `id` and a
 * `ComponentId` key. Keep this enum aligned with the schema files and
 * `packages/core/components/catalog`. To sync it after schema changes, invoke
 * `@components-catalog`.
 *
 * `ComponentId` stays an enum because it is part of the serialized workspace API.
 */
export enum ComponentId {
  ARTICLE_CARD = "articleCard",
  AVATAR = "avatar",
  BAR = "bar",
  BLOCKQUOTE = "blockquote",
  BOARD = "board",
  BUTTON = "button",
  CALENDAR = "calendar",
  CALENDAR_DAY = "calendarDay",
  CARD_STACKED = "cardStacked",
  CHIP = "chip",
  CONTAINER = "container",
  MEDIA_CARD = "mediaCard",
  NOTIFICATION_CARD = "notificationCard",
  PRICING_CARD = "pricingCard",
  PRODUCT_CARD = "productCard",
  PROFILE_CARD = "profileCard",
  STAT_CARD = "statCard",
  CITE = "cite",
  DESCRIPTION_LIST = "descriptionList",
  DIALOG = "dialog",
  FIELDSET = "fieldset",
  FOOTER = "footer",
  FORM_CONTROL = "formControl",
  FRAME = "frame",
  HEADER = "header",
  HR = "hr",
  ICON = "icon",
  IMAGE = "image",
  INPUT = "input",
  LEGEND = "legend",
  LINK = "link",
  LIST = "list",
  ITEM = "item",
  LIST_STANDARD = "listStandard",
  LIST_TEXT = "listText",
  NAV = "nav",
  OPTION_GROUP = "optionGroup",
  SANDBOX = "sandbox",
  SCREEN = "screen",
  SECTION = "section",
  SELECT = "select",
  SIDEBAR = "sidebar",
  SOURCE = "source",
  TABLE = "table",
  TABLE_BODY = "tableBody",
  TABLE_DATA = "tableData",
  TABLE_GRID = "tableGrid",
  TABLE_HEAD = "tableHead",
  TABLE_HEADER = "tableHeader",
  TABLE_ROW_DATA = "tableRowData",
  TEXT = "text",
  TRACK = "track",
  TYPE_SPECIMEN = "typeSpecimen",
  VIDEO = "video",
  WIDGET_TODO = "widgetTodo",
}

export const isComponentId = (id: string): id is ComponentId => {
  return Object.values(ComponentId).includes(id as ComponentId)
}
