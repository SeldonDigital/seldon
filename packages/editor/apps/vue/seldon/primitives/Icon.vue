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

import { ICONS } from "../icons/index"
import { combineClassNames } from "../utils/class-names"
import { getRegisteredIcon } from "../utils/icon-registry"

const props = defineProps<{
  className?: string
  icon?: string
}>()

const iconClassName = computed(() => combineClassNames("sdn-icon", props.className))
const geometry = computed(
  () => ICONS[props.icon ?? "__default__"] ?? getRegisteredIcon(props.icon) ?? ICONS.__default__,
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="geometry.viewBox"
    :fill="geometry.fill ?? 'currentColor'"
    height="1em"
    width="1em"
    :class="iconClassName"
    aria-hidden="true"
    v-html="geometry.body"
  />
</template>
