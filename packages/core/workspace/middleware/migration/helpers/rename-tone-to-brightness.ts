/**
 * Renames all "tone" properties to "brightness" properties in a properties object.
 * Handles tone properties at root level and within background, border, shadow, and gradient objects.
 * @param properties - The properties object to update
 */
export function renameToneToBrightness(properties: any): void {
  if (!properties || typeof properties !== "object") return

  if (properties.background) {
    if (properties.background.tone !== undefined) {
      properties.background.brightness = properties.background.tone
      delete properties.background.tone
    }
  }

  if (properties.border) {
    if (properties.border.tone !== undefined) {
      properties.border.brightness = properties.border.tone
      delete properties.border.tone
    }
    if (properties.border.topTone !== undefined) {
      properties.border.topBrightness = properties.border.topTone
      delete properties.border.topTone
    }
    if (properties.border.rightTone !== undefined) {
      properties.border.rightBrightness = properties.border.rightTone
      delete properties.border.rightTone
    }
    if (properties.border.bottomTone !== undefined) {
      properties.border.bottomBrightness = properties.border.bottomTone
      delete properties.border.bottomTone
    }
    if (properties.border.leftTone !== undefined) {
      properties.border.leftBrightness = properties.border.leftTone
      delete properties.border.leftTone
    }
  }

  if (properties.shadow) {
    if (properties.shadow.tone !== undefined) {
      properties.shadow.brightness = properties.shadow.tone
      delete properties.shadow.tone
    }
  }

  if (properties.gradient) {
    if (properties.gradient.startTone !== undefined) {
      properties.gradient.startBrightness = properties.gradient.startTone
      delete properties.gradient.startTone
    }
    if (properties.gradient.endTone !== undefined) {
      properties.gradient.endBrightness = properties.gradient.endTone
      delete properties.gradient.endTone
    }
  }

  if (properties.tone !== undefined) {
    properties.brightness = properties.tone
    delete properties.tone
  }
}
