import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { ImageSourceValue } from "../shared/utilities/image-source"
import { BooleanValue } from "../shared/option/boolean"
import { ContentValue } from "../shared/exact/string"

/** How much of a media resource the browser should preload before playback. */
export enum Preload {
  NONE = "none",
  METADATA = "metadata",
  AUTO = "auto",
}

/** Records which preload keyword is selected. */
export interface PreloadOptionValue {
  type: ValueType.OPTION
  value: Preload
}

/** Empty, or a preload keyword for media elements. */
export type PreloadValue = EmptyValue | PreloadOptionValue

/** The kind of timed text a track carries. */
export enum TrackKind {
  SUBTITLES = "subtitles",
  CAPTIONS = "captions",
  DESCRIPTIONS = "descriptions",
  CHAPTERS = "chapters",
  METADATA = "metadata",
}

/** Records which track kind keyword is selected. */
export interface TrackKindOptionValue {
  type: ValueType.OPTION
  value: TrackKind
}

/** Empty, or a track kind keyword for caption and subtitle tracks. */
export type TrackKindValue = EmptyValue | TrackKindOptionValue

/** Empty or a boolean toggling native media playback controls. */
export type ControlsValue = EmptyValue | BooleanValue

/** Empty or a boolean toggling automatic playback on load. */
export type AutoPlayValue = EmptyValue | BooleanValue

/** Empty or a boolean toggling repeated playback. */
export type LoopValue = EmptyValue | BooleanValue

/** Empty or a boolean toggling muted playback. */
export type MutedValue = EmptyValue | BooleanValue

/** Empty or a poster image source shown before playback. */
export type PosterValue = ImageSourceValue

/** Empty or the BCP 47 language tag for a track. */
export type SrcLangValue = ContentValue

/** Empty or the human readable label for a track. */
export type TrackLabelValue = ContentValue

/** Empty or a boolean marking a track as the default. */
export type TrackDefaultValue = EmptyValue | BooleanValue

/** Empty or the MIME type string for a media source. */
export type MediaTypeValue = ContentValue

/** Empty or the media query string for a media source. */
export type MediaQueryValue = ContentValue

const booleanValidation = {
  empty: () => true,
  inherit: () => true,
  exact: (value: unknown) => typeof value === "boolean",
} as const

const stringValidation = {
  empty: () => true,
  inherit: () => true,
  exact: (value: unknown) => typeof value === "string",
} as const

/** Defines labels, allowed shapes, and checks for `controls`. */
export const controlsSchema: PropertySchema = {
  name: "controls",
  description: "Whether native playback controls are shown for media",
  supports: ["empty", "inherit", "exact"] as const,
  validation: booleanValidation,
}

/** Defines labels, allowed shapes, and checks for `autoPlay`. */
export const autoPlaySchema: PropertySchema = {
  name: "autoPlay",
  description: "Whether media begins playback automatically on load",
  supports: ["empty", "inherit", "exact"] as const,
  validation: booleanValidation,
}

/** Defines labels, allowed shapes, and checks for `loop`. */
export const loopSchema: PropertySchema = {
  name: "loop",
  description: "Whether media restarts after reaching the end",
  supports: ["empty", "inherit", "exact"] as const,
  validation: booleanValidation,
}

/** Defines labels, allowed shapes, and checks for `muted`. */
export const mutedSchema: PropertySchema = {
  name: "muted",
  description: "Whether media plays without sound",
  supports: ["empty", "inherit", "exact"] as const,
  validation: booleanValidation,
}

/** Defines labels, allowed shapes, and checks for `poster`. */
export const posterSchema: PropertySchema = {
  name: "poster",
  description: "Poster image shown before video playback (URL or path)",
  supports: ["empty", "inherit", "exact"] as const,
  validation: stringValidation,
}

/** Defines labels, allowed shapes, checks, and preset choices for `preload`. */
export const preloadSchema: PropertySchema = {
  name: "preload",
  description: "How much media to preload before playback",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Preload) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Preload),
}

/** Defines labels, allowed shapes, checks, and preset choices for `trackKind`. */
export const trackKindSchema: PropertySchema = {
  name: "trackKind",
  description: "Kind of timed text a track carries",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(TrackKind) as string[]).includes(value),
  },
  presetOptions: () => Object.values(TrackKind),
}

/** Defines labels, allowed shapes, and checks for `srcLang`. */
export const srcLangSchema: PropertySchema = {
  name: "srcLang",
  description: "BCP 47 language tag for a track",
  supports: ["empty", "inherit", "exact"] as const,
  validation: stringValidation,
}

/** Defines labels, allowed shapes, and checks for `trackLabel`. */
export const trackLabelSchema: PropertySchema = {
  name: "trackLabel",
  description: "Human readable label for a track",
  supports: ["empty", "inherit", "exact"] as const,
  validation: stringValidation,
}

/** Defines labels, allowed shapes, and checks for `trackDefault`. */
export const trackDefaultSchema: PropertySchema = {
  name: "trackDefault",
  description: "Whether a track is enabled by default",
  supports: ["empty", "inherit", "exact"] as const,
  validation: booleanValidation,
}

/** Defines labels, allowed shapes, and checks for `mediaType`. */
export const mediaTypeSchema: PropertySchema = {
  name: "mediaType",
  description: "MIME type for a media source",
  supports: ["empty", "inherit", "exact"] as const,
  validation: stringValidation,
}

/** Defines labels, allowed shapes, and checks for `mediaQuery`. */
export const mediaQuerySchema: PropertySchema = {
  name: "mediaQuery",
  description: "Media query for a media source",
  supports: ["empty", "inherit", "exact"] as const,
  validation: stringValidation,
}
