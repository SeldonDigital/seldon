/**
 * To sync this file after component schema changes, invoke `@components-catalog`.
 *
 * The `@components-catalog` rule treats the `.schema.ts` files under
 * `packages/core/components/` as the source of truth and updates this file, the
 * `packages/core/components/constants/` index, and `components/types/component-id.ts`
 * together.
 */
import { invariant } from "../../helpers/utils/invariant"
import { ComponentId } from "../constants"
import { ComponentExport, ComponentSchema } from "../types"
// Boards
import {
  exportConfig as boardExportConfig,
  schema as boardSchema,
} from "./boards/Board.schema"
// Elements
import {
  exportConfig as avatarExportConfig,
  schema as avatarSchema,
} from "./elements/Avatar.schema"
import {
  exportConfig as buttonExportConfig,
  schema as buttonSchema,
} from "./elements/Button.schema"
import {
  exportConfig as chipExportConfig,
  schema as chipSchema,
} from "./elements/Chip.schema"
import {
  exportConfig as formControlExportConfig,
  schema as formControlSchema,
} from "./elements/FormControl.schema"
import {
  exportConfig as itemExportConfig,
  schema as itemSchema,
} from "./elements/Item.schema"
import {
  exportConfig as navExportConfig,
  schema as navSchema,
} from "./elements/Nav.schema"
import {
  exportConfig as optionGroupExportConfig,
  schema as optionGroupSchema,
} from "./elements/OptionGroup.schema"
import {
  exportConfig as sectionExportConfig,
  schema as sectionSchema,
} from "./elements/Section.schema"
import {
  exportConfig as selectExportConfig,
  schema as selectSchema,
} from "./elements/Select.schema"
import {
  exportConfig as headerActionExportConfig,
  schema as headerActionSchema,
} from "./elements/headers/HeaderAction.schema"
import {
  exportConfig as headerCardExportConfig,
  schema as headerCardSchema,
} from "./elements/headers/HeaderCard.schema"
import {
  exportConfig as tableRowDataExportConfig,
  schema as tableRowDataSchema,
} from "./elements/tables/TableRowData.schema"
// Frames
import {
  exportConfig as frameExportConfig,
  schema as frameSchema,
} from "./frames/Frame.schema"
import {
  exportConfig as sandboxExportConfig,
  schema as sandboxSchema,
} from "./frames/Sandbox.schema"
// Modules
import {
  exportConfig as calendarExportConfig,
  schema as calendarSchema,
} from "./modules/Calendar.schema"
import {
  exportConfig as dialogExportConfig,
  schema as dialogSchema,
} from "./modules/Dialog.schema"
import {
  exportConfig as footerExportConfig,
  schema as footerSchema,
} from "./modules/Footer.schema"
import {
  exportConfig as sidebarExportConfig,
  schema as sidebarSchema,
} from "./modules/Sidebar.schema"
import {
  exportConfig as tableExportConfig,
  schema as tableSchema,
} from "./modules/Table.schema"
import {
  exportConfig as typeSpecimenExportConfig,
  schema as typeSpecimenSchema,
} from "./modules/TypeSpecimen.schema"
import {
  exportConfig as widgetTodoExportConfig,
  schema as widgetTodoSchema,
} from "./modules/WidgetTodo.schema"
// Parts
import {
  exportConfig as barExportConfig,
  schema as barSchema,
} from "./parts/Bar.schema"
import {
  exportConfig as fieldsetExportConfig,
  schema as fieldsetSchema,
} from "./parts/Fieldset.schema"
import {
  exportConfig as cardHorizontalExportConfig,
  schema as cardHorizontalSchema,
} from "./parts/cards/CardHorizontal.schema"
import {
  exportConfig as cardProductExportConfig,
  schema as cardProductSchema,
} from "./parts/cards/CardProduct.schema"
import {
  exportConfig as cardStackedExportConfig,
  schema as cardStackedSchema,
} from "./parts/cards/CardStacked.schema"
import {
  exportConfig as listContactsExportConfig,
  schema as listContactsSchema,
} from "./parts/lists/ListContacts.schema"
import {
  exportConfig as listGridExportConfig,
  schema as listGridSchema,
} from "./parts/lists/ListGrid.schema"
import {
  exportConfig as listProductsExportConfig,
  schema as listProductsSchema,
} from "./parts/lists/ListProducts.schema"
import {
  exportConfig as listStandardExportConfig,
  schema as listStandardSchema,
} from "./parts/lists/ListStandard.schema"
import {
  exportConfig as listTodoExportConfig,
  schema as listTodoSchema,
} from "./parts/lists/ListTodo.schema"
// Primitives
import {
  exportConfig as hrExportConfig,
  schema as hrSchema,
} from "./primitives/Hr.schema"
import {
  exportConfig as iconExportConfig,
  schema as iconSchema,
} from "./primitives/Icon.schema"
import {
  exportConfig as imageExportConfig,
  schema as imageSchema,
} from "./primitives/Image.schema"
import {
  exportConfig as inputExportConfig,
  schema as inputSchema,
} from "./primitives/controls/Input.schema"
import {
  exportConfig as legendExportConfig,
  schema as legendSchema,
} from "./primitives/controls/Legend.schema"
import {
  exportConfig as optionExportConfig,
  schema as optionSchema,
} from "./primitives/controls/Option.schema"
import {
  exportConfig as descriptionDetailsExportConfig,
  schema as descriptionDetailsSchema,
} from "./primitives/lists/DescriptionDetails.schema"
import {
  exportConfig as descriptionListExportConfig,
  schema as descriptionListSchema,
} from "./primitives/lists/DescriptionList.schema"
import {
  exportConfig as descriptionTermExportConfig,
  schema as descriptionTermSchema,
} from "./primitives/lists/DescriptionTerm.schema"
import {
  exportConfig as listItemExportConfig,
  schema as listItemSchema,
} from "./primitives/lists/ListItem.schema"
import {
  exportConfig as orderedListExportConfig,
  schema as orderedListSchema,
} from "./primitives/lists/OrderedList.schema"
import {
  exportConfig as unorderedListExportConfig,
  schema as unorderedListSchema,
} from "./primitives/lists/UnorderedList.schema"
import {
  exportConfig as tableDataExportConfig,
  schema as tableDataSchema,
} from "./primitives/tables/TableData.schema"
import {
  exportConfig as tableHeaderExportConfig,
  schema as tableHeaderSchema,
} from "./primitives/tables/TableHeader.schema"
import {
  exportConfig as tableInputExportConfig,
  schema as tableInputSchema,
} from "./primitives/tables/TableInput.schema"
import {
  exportConfig as blockquoteExportConfig,
  schema as blockquoteSchema,
} from "./primitives/texts/Blockquote.schema"
import {
  exportConfig as citeExportConfig,
  schema as citeSchema,
} from "./primitives/texts/Cite.schema"
import {
  exportConfig as codeblockExportConfig,
  schema as codeblockSchema,
} from "./primitives/texts/Codeblock.schema"
import {
  exportConfig as descriptionExportConfig,
  schema as descriptionSchema,
} from "./primitives/texts/Description.schema"
import {
  exportConfig as linkExportConfig,
  schema as linkSchema,
} from "./primitives/texts/Link.schema"
import {
  exportConfig as textExportConfig,
  schema as textSchema,
} from "./primitives/texts/Text.schema"
import {
  exportConfig as sourceExportConfig,
  schema as sourceSchema,
} from "./primitives/video/Source.schema"
import {
  exportConfig as trackExportConfig,
  schema as trackSchema,
} from "./primitives/video/Track.schema"
import {
  exportConfig as videoExportConfig,
  schema as videoSchema,
} from "./primitives/video/Video.schema"
// Screens
import {
  exportConfig as screenExportConfig,
  schema as screenSchema,
} from "./screens/Screen.schema"

const elements: ComponentSchema[] = [
  avatarSchema,
  buttonSchema,
  chipSchema,
  formControlSchema,
  optionGroupSchema,
  headerActionSchema,
  headerCardSchema,
  itemSchema,
  navSchema,
  sectionSchema,
  selectSchema,
  tableRowDataSchema,
]

const primitives: ComponentSchema[] = [
  hrSchema,
  iconSchema,
  imageSchema,
  inputSchema,
  legendSchema,
  optionSchema,
  descriptionDetailsSchema,
  descriptionListSchema,
  descriptionTermSchema,
  listItemSchema,
  orderedListSchema,
  unorderedListSchema,
  tableDataSchema,
  tableHeaderSchema,
  tableInputSchema,
  blockquoteSchema,
  citeSchema,
  codeblockSchema,
  descriptionSchema,
  linkSchema,
  textSchema,
  sourceSchema,
  trackSchema,
  videoSchema,
]

const parts: ComponentSchema[] = [
  barSchema,
  cardHorizontalSchema,
  cardProductSchema,
  cardStackedSchema,
  fieldsetSchema,
  listContactsSchema,
  listGridSchema,
  listProductsSchema,
  listStandardSchema,
  listTodoSchema,
]

const modules: ComponentSchema[] = [
  calendarSchema,
  dialogSchema,
  typeSpecimenSchema,
  footerSchema,
  sidebarSchema,
  tableSchema,
  widgetTodoSchema,
]

const boards: ComponentSchema[] = [boardSchema]

const screens: ComponentSchema[] = [screenSchema]

const frames: ComponentSchema[] = [frameSchema, sandboxSchema]

export type Catalog = {
  frames: ComponentSchema[]
  primitives: ComponentSchema[]
  elements: ComponentSchema[]
  parts: ComponentSchema[]
  modules: ComponentSchema[]
  screens: ComponentSchema[]
  boards: ComponentSchema[]
}

export const catalog: Catalog = {
  frames,
  primitives,
  elements,
  parts,
  modules,
  screens,
  boards,
}

const schemasById: Record<string, ComponentSchema> = Object.fromEntries(
  [
    ...frames,
    ...primitives,
    ...elements,
    ...parts,
    ...modules,
    ...screens,
    ...boards,
  ].map((schema) => [schema.id, schema]),
)

export function getComponentSchema(id: ComponentId): ComponentSchema {
  const match = schemasById[id]
  invariant(match, `Schema ${id} not found`)
  return match
}

const exportConfigById: Partial<Record<ComponentId, ComponentExport>> = {
  // Elements
  [ComponentId.AVATAR]: avatarExportConfig,
  [ComponentId.BUTTON]: buttonExportConfig,
  [ComponentId.CHIP]: chipExportConfig,
  [ComponentId.FORM_CONTROL]: formControlExportConfig,
  [ComponentId.OPTION_GROUP]: optionGroupExportConfig,
  [ComponentId.HEADER_ACTION]: headerActionExportConfig,
  [ComponentId.HEADER_CARD]: headerCardExportConfig,
  [ComponentId.ITEM]: itemExportConfig,
  [ComponentId.NAV]: navExportConfig,
  [ComponentId.SECTION]: sectionExportConfig,
  [ComponentId.TABLE_ROW_DATA]: tableRowDataExportConfig,

  // Frames
  [ComponentId.FRAME]: frameExportConfig,
  [ComponentId.SANDBOX]: sandboxExportConfig,

  // Modules
  [ComponentId.CALENDAR]: calendarExportConfig,
  [ComponentId.FOOTER]: footerExportConfig,
  [ComponentId.DIALOG]: dialogExportConfig,
  [ComponentId.TYPE_SPECIMEN]: typeSpecimenExportConfig,
  [ComponentId.SIDEBAR]: sidebarExportConfig,
  [ComponentId.TABLE]: tableExportConfig,
  [ComponentId.WIDGET_TODO]: widgetTodoExportConfig,

  // Parts
  [ComponentId.BAR]: barExportConfig,
  [ComponentId.CARD_HORIZONTAL]: cardHorizontalExportConfig,
  [ComponentId.CARD_PRODUCT]: cardProductExportConfig,
  [ComponentId.CARD_STACKED]: cardStackedExportConfig,
  [ComponentId.FIELDSET]: fieldsetExportConfig,
  [ComponentId.LIST_CONTACTS]: listContactsExportConfig,
  [ComponentId.LIST_GRID]: listGridExportConfig,
  [ComponentId.LIST_PRODUCTS]: listProductsExportConfig,
  [ComponentId.LIST_STANDARD]: listStandardExportConfig,
  [ComponentId.LIST_TODO]: listTodoExportConfig,

  // Primitives
  [ComponentId.HR]: hrExportConfig,
  [ComponentId.ICON]: iconExportConfig,
  [ComponentId.IMAGE]: imageExportConfig,
  [ComponentId.INPUT]: inputExportConfig,
  [ComponentId.LEGEND]: legendExportConfig,
  [ComponentId.OPTION]: optionExportConfig,
  [ComponentId.SELECT]: selectExportConfig,
  [ComponentId.DESCRIPTION_DETAILS]: descriptionDetailsExportConfig,
  [ComponentId.DESCRIPTION_LIST]: descriptionListExportConfig,
  [ComponentId.DESCRIPTION_TERM]: descriptionTermExportConfig,
  [ComponentId.LIST_ITEM]: listItemExportConfig,
  [ComponentId.ORDERED_LIST]: orderedListExportConfig,
  [ComponentId.UNORDERED_LIST]: unorderedListExportConfig,
  [ComponentId.TABLE_DATA]: tableDataExportConfig,
  [ComponentId.TABLE_HEADER]: tableHeaderExportConfig,
  [ComponentId.TABLE_INPUT]: tableInputExportConfig,
  [ComponentId.BLOCKQUOTE]: blockquoteExportConfig,
  [ComponentId.CITE]: citeExportConfig,
  [ComponentId.CODEBLOCK]: codeblockExportConfig,
  [ComponentId.DESCRIPTION]: descriptionExportConfig,
  [ComponentId.LINK]: linkExportConfig,
  [ComponentId.TEXT]: textExportConfig,
  [ComponentId.SOURCE]: sourceExportConfig,
  [ComponentId.TRACK]: trackExportConfig,
  [ComponentId.VIDEO]: videoExportConfig,

  // Screens
  [ComponentId.SCREEN]: screenExportConfig,

  // Boards
  [ComponentId.BOARD]: boardExportConfig,
}

export function getComponentExportConfig(id: ComponentId): ComponentExport {
  const match = exportConfigById[id]
  invariant(match, `Export config for ${id} not found`)
  return match
}
