<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v"

/**
 * Smooth expand/collapse animation for sidebar tree nodes. Animates height and
 * opacity when `isExpanded` flips, mounting and unmounting the content through
 * presence so collapse plays before removal. Vue port of the React
 * `FramerExpandable` bespoke view, built on motion-v instead of framer-motion.
 */
defineProps<{ isExpanded: boolean }>()

const collapsed = { height: 0, opacity: 0 }
const expanded = { height: "auto", opacity: 1 }
const transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
</script>

<template>
  <AnimatePresence :initial="false">
    <motion.div
      v-if="isExpanded"
      :initial="collapsed"
      :animate="expanded"
      :exit="collapsed"
      :transition="transition"
      style="overflow: hidden"
    >
      <slot />
    </motion.div>
  </AnimatePresence>
</template>
