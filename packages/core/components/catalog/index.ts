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
  exportConfig as calendarDayExportConfig,
  schema as calendarDaySchema,
} from "./elements/CalendarDay.schema"
import {
  exportConfig as chipExportConfig,
  schema as chipSchema,
} from "./elements/Chip.schema"
import {
  exportConfig as colorChipExportConfig,
  schema as colorChipSchema,
} from "./elements/ColorChip.schema"
import {
  exportConfig as comboboxFieldExportConfig,
  schema as comboboxFieldSchema,
} from "./elements/ComboboxField.schema"
import {
  exportConfig as descriptionListExportConfig,
  schema as descriptionListSchema,
} from "./elements/DescriptionList.schema"
import {
  exportConfig as formControlExportConfig,
  schema as formControlSchema,
} from "./elements/FormControl.schema"
import {
  exportConfig as headerExportConfig,
  schema as headerSchema,
} from "./elements/Header.schema"
import {
  exportConfig as itemExportConfig,
  schema as itemSchema,
} from "./elements/Item.schema"
import {
  exportConfig as listExportConfig,
  schema as listSchema,
} from "./elements/List.schema"
import {
  exportConfig as listboxOptionExportConfig,
  schema as listboxOptionSchema,
} from "./elements/ListboxOption.schema"
import {
  exportConfig as menuItemExportConfig,
  schema as menuItemSchema,
} from "./elements/MenuItem.schema"
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
  exportConfig as tableBodyExportConfig,
  schema as tableBodySchema,
} from "./elements/tables/TableBody.schema"
import {
  exportConfig as tableDataExportConfig,
  schema as tableDataSchema,
} from "./elements/tables/TableData.schema"
import {
  exportConfig as tableGridExportConfig,
  schema as tableGridSchema,
} from "./elements/tables/TableGrid.schema"
import {
  exportConfig as tableHeadExportConfig,
  schema as tableHeadSchema,
} from "./elements/tables/TableHead.schema"
import {
  exportConfig as tableHeaderExportConfig,
  schema as tableHeaderSchema,
} from "./elements/tables/TableHeader.schema"
import {
  exportConfig as tableRowDataExportConfig,
  schema as tableRowDataSchema,
} from "./elements/tables/TableRowData.schema"
// Frames
import {
  exportConfig as containerExportConfig,
  schema as containerSchema,
} from "./frames/Container.schema"
import {
  exportConfig as frameExportConfig,
  schema as frameSchema,
} from "./frames/Frame.schema"
import {
  exportConfig as sandboxExportConfig,
  schema as sandboxSchema,
} from "./frames/Sandbox.schema"
import {
  exportConfig as calendarExportConfig,
  schema as calendarSchema,
} from "./modules/Calendar.schema"
import {
  exportConfig as dialogExportConfig,
  schema as dialogSchema,
} from "./modules/Dialog.schema"
import {
  exportConfig as sidebarExportConfig,
  schema as sidebarSchema,
} from "./modules/Sidebar.schema"
import {
  exportConfig as tableExportConfig,
  schema as tableSchema,
} from "./modules/Table.schema"
import {
  exportConfig as widgetTodoExportConfig,
  schema as widgetTodoSchema,
} from "./modules/WidgetTodo.schema"
import {
  exportConfig as footerExportConfig,
  schema as footerSchema,
} from "./modules/footers/Footer.schema"
// Modules
import {
  exportConfig as linksFooterExportConfig,
  schema as linksFooterSchema,
} from "./modules/footers/LinksFooter.schema"
// Parts
import {
  exportConfig as barExportConfig,
  schema as barSchema,
} from "./parts/Bar.schema"
import {
  exportConfig as comboboxExportConfig,
  schema as comboboxSchema,
} from "./parts/Combobox.schema"
import {
  exportConfig as fieldsetExportConfig,
  schema as fieldsetSchema,
} from "./parts/Fieldset.schema"
import {
  exportConfig as listStandardExportConfig,
  schema as listStandardSchema,
} from "./parts/ListStandard.schema"
import {
  exportConfig as listboxExportConfig,
  schema as listboxSchema,
} from "./parts/Listbox.schema"
import {
  exportConfig as menuExportConfig,
  schema as menuSchema,
} from "./parts/Menu.schema"
import {
  exportConfig as topbarExportConfig,
  schema as topbarSchema,
} from "./parts/Topbar.schema"
import {
  exportConfig as articleCardExportConfig,
  schema as articleCardSchema,
} from "./parts/cards/ArticleCard.schema"
import {
  exportConfig as cardStackedExportConfig,
  schema as cardStackedSchema,
} from "./parts/cards/Card.schema"
import {
  exportConfig as mediaCardExportConfig,
  schema as mediaCardSchema,
} from "./parts/cards/MediaCard.schema"
import {
  exportConfig as notificationCardExportConfig,
  schema as notificationCardSchema,
} from "./parts/cards/NotificationCard.schema"
import {
  exportConfig as pricingCardExportConfig,
  schema as pricingCardSchema,
} from "./parts/cards/PricingCard.schema"
import {
  exportConfig as productCardExportConfig,
  schema as productCardSchema,
} from "./parts/cards/ProductCard.schema"
import {
  exportConfig as profileCardExportConfig,
  schema as profileCardSchema,
} from "./parts/cards/ProfileCard.schema"
import {
  exportConfig as statCardExportConfig,
  schema as statCardSchema,
} from "./parts/cards/StatCard.schema"
import {
  exportConfig as boldCtaExportConfig,
  schema as boldCtaSchema,
} from "./parts/ctas/BoldCTA.schema"
import {
  exportConfig as ctaExportConfig,
  schema as ctaSchema,
} from "./parts/ctas/CTA.schema"
import {
  exportConfig as joinCtaExportConfig,
  schema as joinCtaSchema,
} from "./parts/ctas/JoinCTA.schema"
import {
  exportConfig as socialProofCtaExportConfig,
  schema as socialProofCtaSchema,
} from "./parts/ctas/SocialProofCTA.schema"
import {
  exportConfig as subscribeCtaExportConfig,
  schema as subscribeCtaSchema,
} from "./parts/ctas/SubscribeCTA.schema"
import {
  exportConfig as colorSpecimenExportConfig,
  schema as colorSpecimenSchema,
} from "./parts/specimens/ColorSpecimen.schema"
import {
  exportConfig as typeSpecimenExportConfig,
  schema as typeSpecimenSchema,
} from "./parts/specimens/TypeSpecimen.schema"
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
  exportConfig as listItemExportConfig,
  schema as listItemSchema,
} from "./primitives/ListItem.schema"
import {
  exportConfig as inputExportConfig,
  schema as inputSchema,
} from "./primitives/controls/Input.schema"
import {
  exportConfig as legendExportConfig,
  schema as legendSchema,
} from "./primitives/controls/Legend.schema"
import {
  exportConfig as textareaExportConfig,
  schema as textareaSchema,
} from "./primitives/controls/Textarea.schema"
import {
  exportConfig as blockquoteExportConfig,
  schema as blockquoteSchema,
} from "./primitives/texts/Blockquote.schema"
import {
  exportConfig as citeExportConfig,
  schema as citeSchema,
} from "./primitives/texts/Cite.schema"
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
import {
  exportConfig as themeSpecExportConfig,
  schema as themeSpecSchema,
} from "./screens/ThemeSpec.schema"

const elements: ComponentSchema[] = [
  avatarSchema,
  buttonSchema,
  calendarDaySchema,
  chipSchema,
  colorChipSchema,
  formControlSchema,
  optionGroupSchema,
  headerSchema,
  descriptionListSchema,
  itemSchema,
  menuItemSchema,
  listboxOptionSchema,
  comboboxFieldSchema,
  navSchema,
  listSchema,
  sectionSchema,
  selectSchema,
  tableGridSchema,
  tableHeadSchema,
  tableBodySchema,
  tableDataSchema,
  tableHeaderSchema,
  tableRowDataSchema,
]

const primitives: ComponentSchema[] = [
  hrSchema,
  iconSchema,
  imageSchema,
  inputSchema,
  legendSchema,
  textareaSchema,
  listItemSchema,
  blockquoteSchema,
  citeSchema,
  linkSchema,
  textSchema,
  sourceSchema,
  trackSchema,
  videoSchema,
]

const parts: ComponentSchema[] = [
  barSchema,
  topbarSchema,
  cardStackedSchema,
  fieldsetSchema,
  listStandardSchema,
  listboxSchema,
  menuSchema,
  comboboxSchema,
  articleCardSchema,
  mediaCardSchema,
  notificationCardSchema,
  pricingCardSchema,
  productCardSchema,
  profileCardSchema,
  statCardSchema,
  ctaSchema,
  subscribeCtaSchema,
  boldCtaSchema,
  joinCtaSchema,
  socialProofCtaSchema,
  typeSpecimenSchema,
  colorSpecimenSchema,
]

const modules: ComponentSchema[] = [
  linksFooterSchema,
  calendarSchema,
  dialogSchema,
  footerSchema,
  sidebarSchema,
  tableSchema,
  widgetTodoSchema,
]

const boards: ComponentSchema[] = [boardSchema]

const screens: ComponentSchema[] = [screenSchema, themeSpecSchema]

const frames: ComponentSchema[] = [containerSchema, frameSchema, sandboxSchema]

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

/**
 * Non-throwing schema lookup for ids that may not resolve, such as catalog ids
 * read from a workspace file authored against an older component set.
 */
export function findComponentSchema(id: string): ComponentSchema | undefined {
  return schemasById[id]
}

const exportConfigById: Partial<Record<ComponentId, ComponentExport>> = {
  // Elements
  [ComponentId.AVATAR]: avatarExportConfig,
  [ComponentId.BUTTON]: buttonExportConfig,
  [ComponentId.CALENDAR_DAY]: calendarDayExportConfig,
  [ComponentId.CHIP]: chipExportConfig,
  [ComponentId.COLOR_CHIP]: colorChipExportConfig,
  [ComponentId.FORM_CONTROL]: formControlExportConfig,
  [ComponentId.OPTION_GROUP]: optionGroupExportConfig,
  [ComponentId.HEADER]: headerExportConfig,
  [ComponentId.DESCRIPTION_LIST]: descriptionListExportConfig,
  [ComponentId.ITEM]: itemExportConfig,
  [ComponentId.MENU_ITEM]: menuItemExportConfig,
  [ComponentId.LISTBOX_OPTION]: listboxOptionExportConfig,
  [ComponentId.COMBOBOX_FIELD]: comboboxFieldExportConfig,
  [ComponentId.NAV]: navExportConfig,
  [ComponentId.LIST]: listExportConfig,
  [ComponentId.SECTION]: sectionExportConfig,
  [ComponentId.TABLE_GRID]: tableGridExportConfig,
  [ComponentId.TABLE_HEAD]: tableHeadExportConfig,
  [ComponentId.TABLE_BODY]: tableBodyExportConfig,
  [ComponentId.TABLE_DATA]: tableDataExportConfig,
  [ComponentId.TABLE_HEADER]: tableHeaderExportConfig,
  [ComponentId.TABLE_ROW_DATA]: tableRowDataExportConfig,

  // Frames
  [ComponentId.CONTAINER]: containerExportConfig,
  [ComponentId.FRAME]: frameExportConfig,
  [ComponentId.SANDBOX]: sandboxExportConfig,

  // Modules
  [ComponentId.LINKS_FOOTER]: linksFooterExportConfig,
  [ComponentId.CALENDAR]: calendarExportConfig,
  [ComponentId.FOOTER]: footerExportConfig,
  [ComponentId.DIALOG]: dialogExportConfig,
  [ComponentId.SIDEBAR]: sidebarExportConfig,
  [ComponentId.TABLE]: tableExportConfig,
  [ComponentId.WIDGET_TODO]: widgetTodoExportConfig,

  // Parts
  [ComponentId.BAR]: barExportConfig,
  [ComponentId.TOPBAR]: topbarExportConfig,
  [ComponentId.CARD_STACKED]: cardStackedExportConfig,
  [ComponentId.FIELDSET]: fieldsetExportConfig,
  [ComponentId.LIST_STANDARD]: listStandardExportConfig,
  [ComponentId.LISTBOX]: listboxExportConfig,
  [ComponentId.MENU]: menuExportConfig,
  [ComponentId.COMBOBOX]: comboboxExportConfig,
  [ComponentId.ARTICLE_CARD]: articleCardExportConfig,
  [ComponentId.MEDIA_CARD]: mediaCardExportConfig,
  [ComponentId.NOTIFICATION_CARD]: notificationCardExportConfig,
  [ComponentId.PRICING_CARD]: pricingCardExportConfig,
  [ComponentId.PRODUCT_CARD]: productCardExportConfig,
  [ComponentId.PROFILE_CARD]: profileCardExportConfig,
  [ComponentId.STAT_CARD]: statCardExportConfig,
  [ComponentId.CTA]: ctaExportConfig,
  [ComponentId.SUBSCRIBE_CTA]: subscribeCtaExportConfig,
  [ComponentId.BOLD_CTA]: boldCtaExportConfig,
  [ComponentId.JOIN_CTA]: joinCtaExportConfig,
  [ComponentId.SOCIAL_PROOF_CTA]: socialProofCtaExportConfig,
  [ComponentId.TYPE_SPECIMEN]: typeSpecimenExportConfig,
  [ComponentId.COLOR_SPECIMEN]: colorSpecimenExportConfig,

  // Primitives
  [ComponentId.HR]: hrExportConfig,
  [ComponentId.ICON]: iconExportConfig,
  [ComponentId.IMAGE]: imageExportConfig,
  [ComponentId.INPUT]: inputExportConfig,
  [ComponentId.LEGEND]: legendExportConfig,
  [ComponentId.TEXTAREA]: textareaExportConfig,
  [ComponentId.SELECT]: selectExportConfig,
  [ComponentId.LIST_ITEM]: listItemExportConfig,
  [ComponentId.BLOCKQUOTE]: blockquoteExportConfig,
  [ComponentId.CITE]: citeExportConfig,
  [ComponentId.LINK]: linkExportConfig,
  [ComponentId.TEXT]: textExportConfig,
  [ComponentId.SOURCE]: sourceExportConfig,
  [ComponentId.TRACK]: trackExportConfig,
  [ComponentId.VIDEO]: videoExportConfig,

  // Screens
  [ComponentId.SCREEN]: screenExportConfig,
  [ComponentId.THEME_SPEC]: themeSpecExportConfig,

  // Boards
  [ComponentId.BOARD]: boardExportConfig,
}

export function getComponentExportConfig(id: ComponentId): ComponentExport {
  const match = exportConfigById[id]
  invariant(match, `Export config for ${id} not found`)
  return match
}
