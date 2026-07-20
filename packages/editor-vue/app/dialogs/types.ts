export type CatalogDialogItem = {
  id: string
  icon: string
  name: string
  description: string
}

export type CatalogDialogCategory<T extends CatalogDialogItem> = {
  category: string
  items: T[]
}
