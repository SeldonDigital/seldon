import {
  TransformStrategy,
  transformSource,
} from "../../react/utils/transform-source"

/**
 * Insert the base styles into the stylesheet, like the font size and the hairline
 * @param stylesheet
 * @returns The stylesheet with the base styles inserted
 */
export function insertBaseStyles(stylesheet: string) {
  const baseFontSize = "16px" // Change this when we've settled on a base font size

  // Check if base styles already exist
  if (stylesheet.includes("Base styles")) {
    return stylesheet
  }

  return transformSource({
    source: stylesheet,
    strategy: TransformStrategy.APPEND,
    content: `

/********************************************
 *                                          *
 *               Base styles                *
 *                                          *
 ********************************************/


html {
  font-size: ${baseFontSize};
}

:root {
--hairline: 1px;
}

/* For devices with a 2x pixel ratio */
@media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-resolution: 192dpi) {
  :root {
    --hairline: 0.5px;
  }
}

/* For devices with a 3x pixel ratio */
@media only screen and (-webkit-min-device-pixel-ratio: 3),
  only screen and (min-resolution: 288dpi) {
  :root {
    --hairline: 0.33px;
  }
}

/* For devices with a 4x pixel ratio */
@media only screen and (-webkit-min-device-pixel-ratio: 4),
  only screen and (min-resolution: 384dpi) {
  :root {
    --hairline: 0.25px;
  }
}
`,
  })
}
