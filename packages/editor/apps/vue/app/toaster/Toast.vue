<script setup lang="ts">
// BESPOKE-VIEW: hand-authored transitional View with inline token styling.
// Replace with a generated workspace component once one covers the toast card.
// Vue port of the React `Toast.bespoke`.
import { motion } from "motion-v"

import type { CSSProperties } from "vue"

defineProps<{ message: string }>()

/** How far a toast rises as it arrives, in animation pixels rather than layout. */
const RISE_DISTANCE = 10

const toastVariants = {
  initial: { opacity: 0, y: RISE_DISTANCE },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: RISE_DISTANCE },
}

const styles: Record<string, CSSProperties> = {
  toast: {
    padding: "var(--sdn-paddings-cozy)",
    backgroundColor: "var(--sdn-swatch-white)",
    borderRadius: "var(--sdn-corners-compact)",
    boxShadow:
      "0 var(--sdn-sizes-xsmall) var(--sdn-sizes-small) color-mix(in srgb, var(--sdn-swatch-black) 15%, transparent)",
    outline: "var(--sdn-border-width-small) solid var(--sdn-swatch-black)",
    color: "var(--sdn-swatch-black)",
  },
  message: { fontSize: "var(--sdn-font-size-small)" },
}
</script>

<template>
  <motion.div
    layout
    :variants="toastVariants"
    initial="initial"
    animate="animate"
    exit="exit"
    :style="styles.toast"
    role="status"
  >
    <p :style="styles.message">{{ message }}</p>
  </motion.div>
</template>
