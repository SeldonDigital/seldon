import { Harmony, Ratio } from "@seldon/core/themes/types"

export const ratioOptions = [
  {
    name: `${Ratio.MinorSecond} - Minor Second`,
    value: String(Ratio.MinorSecond),
  },
  {
    name: `${Ratio.MajorSecond} - Major Second`,
    value: String(Ratio.MajorSecond),
  },
  {
    name: `${Ratio.MinorThird} - Minor Third`,
    value: String(Ratio.MinorThird),
  },
  {
    name: `${Ratio.MajorThird} - Major Third`,
    value: String(Ratio.MajorThird),
  },
  {
    name: `${Ratio.PerfectFourth} - Perfect Fourth`,
    value: String(Ratio.PerfectFourth),
  },
  {
    name: `${Ratio.AugmentedFourth} - Augmented Fourth`,
    value: String(Ratio.AugmentedFourth),
  },
  {
    name: `${Ratio.PerfectFifth} - Perfect Fifth`,
    value: String(Ratio.PerfectFifth),
  },
  {
    name: `${Ratio.MinorSixth} - Minor Sixth`,
    value: String(Ratio.MinorSixth),
  },
  {
    name: `${Ratio.GoldenRatio} - Golden Ratio`,
    value: String(Ratio.GoldenRatio),
  },
  {
    name: `${Ratio.MajorSixth} - Major Sixth`,
    value: String(Ratio.MajorSixth),
  },
  {
    name: `${Ratio.MinorSeventh} - Minor Seventh`,
    value: String(Ratio.MinorSeventh),
  },
  {
    name: `${Ratio.MajorSeventh} - Major Seventh`,
    value: String(Ratio.MajorSeventh),
  },
  { name: `${Ratio.Octave} - Octave`, value: String(Ratio.Octave) },
  {
    name: `${Ratio.MajorTenth} - Major Tenth`,
    value: String(Ratio.MajorTenth),
  },
  {
    name: `${Ratio.MajorEleventh} - Major Eleventh`,
    value: String(Ratio.MajorEleventh),
  },
  {
    name: `${Ratio.MajorTwelfth} - Major Twelfth`,
    value: String(Ratio.MajorTwelfth),
  },
  {
    name: `${Ratio.DoubleOctave} - Double Octave`,
    value: String(Ratio.DoubleOctave),
  },
]

export const harmonyOptions = [
  {
    name: "Monochromatic",
    value: String(Harmony.Monochromatic),
  },
  {
    name: "Complementary",
    value: String(Harmony.Complementary),
  },
  {
    name: "Split Complementary",
    value: String(Harmony.SplitComplementary),
  },
  {
    name: "Triadic",
    value: String(Harmony.Triadic),
  },
  {
    name: "Analogous",
    value: String(Harmony.Analogous),
  },
  {
    name: "Square",
    value: String(Harmony.Square),
  },
]
