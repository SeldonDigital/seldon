export interface ComponentTreeRef {
  id: string
  children?: ComponentTreeRef[]
}

export interface ThemeEntryRef {
  id: string
}

export interface FontCollectionEntryRef {
  id: string
}

export interface IconSetEntryRef {
  id: string
}

export interface MediaEntryRef {
  id: string
}

export type ComponentResourceRef =
  | ThemeEntryRef
  | FontCollectionEntryRef
  | IconSetEntryRef
  | MediaEntryRef
