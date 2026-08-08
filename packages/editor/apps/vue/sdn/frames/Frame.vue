<script setup lang="ts">
/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

import { computed } from "vue"

import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  wrapperElement?: string
}>()

const tag = computed(() => props.wrapperElement ?? "div")
const rootClassName = computed(() => combineClassNames(props.className))
</script>

<template>
  <component :is="tag" :class="rootClassName">
    <slot />
  </component>
</template>
