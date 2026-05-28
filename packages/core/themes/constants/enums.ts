/**
 * Theme enumerations (ratio scale, color harmony).
 */

export enum Ratio {
  "15:16" = 1.067,
  MinorSecond = 1.067,
  "8:9" = 1.125,
  MajorSecond = 1.125,
  "5:6" = 1.2,
  MinorThird = 1.2,
  "4:5" = 1.25,
  MajorThird = 1.25,
  "3:4" = 1.333,
  PerfectFourth = 1.333,
  "1:√2" = 1.414,
  AugmentedFourth = 1.414,
  "2:3" = 1.5,
  PerfectFifth = 1.5,
  "5:8" = 1.6,
  MinorSixth = 1.6,
  "1:1.618" = 1.618,
  GoldenRatio = 1.618,
  "3:5" = 1.667,
  MajorSixth = 1.667,
  "9:16" = 1.778,
  MinorSeventh = 1.778,
  "8:15" = 1.875,
  MajorSeventh = 1.875,
  "1:2" = 2,
  Octave = 2,
  "2:5" = 2.5,
  MajorTenth = 2.5,
  "3:8" = 2.667,
  MajorEleventh = 2.667,
  "1:3" = 3,
  MajorTwelfth = 3,
  "1:4" = 4,
  DoubleOctave = 4,
}

export enum Harmony {
  Complementary,
  SplitComplementary,
  Triadic,
  Analogous,
  Square,
  Monochromatic,
}
