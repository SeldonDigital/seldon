<script setup lang="ts">
import { useToastStore } from "@app/toaster/toast-store"
import { AnimatePresence } from "motion-v"
import { storeToRefs } from "pinia"

import Toast from "./Toast.vue"
import ToastStack from "./ToastStack.vue"

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>

<template>
  <Teleport to="body">
    <ToastStack>
      <AnimatePresence mode="popLayout">
        <Toast v-for="toast in toasts" :key="toast.id" :message="toast.message" />
      </AnimatePresence>
    </ToastStack>
  </Teleport>
</template>
