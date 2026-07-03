/**
 * Theme enumerations (ratio scale, color harmony).
 */

export enum Ratio {
  MinorSecond = 1.067, // 15:16
  MajorSecond = 1.125, // 8:9
  MinorThird = 1.2, // 5:6
  MajorThird = 1.25, // 4:5
  PerfectFourth = 1.333, // 3:4
  AugmentedFourth = 1.414, // 1:√2
  PerfectFifth = 1.5, // 2:3
  MinorSixth = 1.6, // 5:8
  GoldenRatio = 1.618, // 1:1.618
  MajorSixth = 1.667, // 3:5
  MinorSeventh = 1.778, // 9:16
  MajorSeventh = 1.875, // 8:15
  Octave = 2, // 1:2
  MajorTenth = 2.5, // 2:5
  MajorEleventh = 2.667, // 3:8
  MajorTwelfth = 3, // 1:3
  DoubleOctave = 4, // 1:4
}

export enum Harmony {
  Complementary,
  SplitComplementary,
  Triadic,
  Analogous,
  Square,
  Monochromatic,
}

/** Color modes a theme can be authored in. */
export const THEME_MODES = ["light", "dark"] as const

/**
 * The mode a theme's authored colors represent. Factory export derives the
 * opposite mode from it. It does not change how theme colors compute.
 */
export type ThemeMode = (typeof THEME_MODES)[number]
