/**
 * The component id union for the catalog. Each id matches a schema's `id` and a
 * `ComponentId` key. Keep this enum aligned with the schema files and
 * `packages/core/components/catalog`. To sync it after schema changes, invoke
 * `@components-catalog`.
 *
 * `ComponentId` stays an enum because it is part of the serialized workspace API.
 */
export enum ComponentId {
  AVATAR = "avatar",
  BAR = "bar",
  BLOCKQUOTE = "blockquote",
  BOARD = "board",
  BUTTON = "button",
  CALENDAR = "calendar",
  CARD_HORIZONTAL = "cardHorizontal",
  CARD_PRODUCT = "cardProduct",
  CARD_STACKED = "cardStacked",
  CHIP = "chip",
  CITE = "cite",
  DESCRIPTION_DETAILS = "descriptionDetails",
  DESCRIPTION_LIST = "descriptionList",
  DESCRIPTION_TERM = "descriptionTerm",
  DIALOG = "dialog",
  FIELDSET = "fieldset",
  FOOTER = "footer",
  FORM_CONTROL = "formControl",
  FRAME = "frame",
  HEADER_ACTION = "headerAction",
  HEADER_CARD = "headerCard",
  HR = "hr",
  ICON = "icon",
  IMAGE = "image",
  INPUT = "input",
  LEGEND = "legend",
  LINK = "link",
  LIST_CONTACTS = "listContacts",
  LIST_GRID = "listGrid",
  LIST_ITEM = "listItem",
  ITEM = "item",
  LIST_PRODUCTS = "listProducts",
  LIST_STANDARD = "listStandard",
  LIST_TODO = "listTodo",
  NAV = "nav",
  OPTION_GROUP = "optionGroup",
  ORDERED_LIST = "orderedList",
  SANDBOX = "sandbox",
  SCREEN = "screen",
  SECTION = "section",
  SELECT = "select",
  SIDEBAR = "sidebar",
  SOURCE = "source",
  TABLE = "table",
  TABLE_DATA = "tableData",
  TABLE_HEADER = "tableHeader",
  TABLE_ROW_DATA = "tableRowData",
  TEXT = "text",
  TRACK = "track",
  TYPE_SPECIMEN = "typeSpecimen",
  UNORDERED_LIST = "unorderedList",
  VIDEO = "video",
  WIDGET_TODO = "widgetTodo",
}

export const isComponentId = (id: string): id is ComponentId => {
  return Object.values(ComponentId).includes(id as ComponentId)
}
