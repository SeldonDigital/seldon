/**
 * Image fit values for image sizing behavior.
 */
export enum ImageFit {
  ORIGINAL = "original",
  CONTAIN = "contain",
  COVER = "cover",
  STRETCH = "stretch",
}

/**
 * Readable image fit options for interface.
 */
export const IMAGE_FIT_OPTIONS: { name: string; value: ImageFit }[] = [
  { name: "Original", value: ImageFit.ORIGINAL },
  { name: "Cover", value: ImageFit.COVER },
  { name: "Contain", value: ImageFit.CONTAIN },
  { name: "Stretch", value: ImageFit.STRETCH },
]
