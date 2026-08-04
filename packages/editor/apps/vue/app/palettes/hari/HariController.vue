<script setup lang="ts">
// Gate for the Hari palette. Mounts the floating panel only while the Hari
// palette is open so it recenters on each open and its floating-window hooks run
// only when open, matching the other floating view-models. The palette flag is
// independent of the exclusive dialog slot, so Hari coexists with any open
// dialog. The panel's saved rect reopens it where the user left it. Vue port of
// the React `HariController` gate.
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { usePanelStore } from "@app/editor/panel-store"
import FloatingPanel from "@app/windows/FloatingPanel.vue"
import { storeToRefs } from "pinia"

import HariPanel from "./HariPanel.vue"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 480

const panel = usePanelStore()
const config = useEditorConfigStore()
const { aiChatOpen } = storeToRefs(panel)
const { hariPanelRect } = storeToRefs(config)

function close(): void {
  panel.closeAiChat()
}
</script>

<template>
  <FloatingPanel
    v-if="aiChatOpen"
    :initial-width="HARI_INITIAL_WIDTH"
    :initial-height="HARI_INITIAL_HEIGHT"
    :on-close="close"
    palette-id="hari"
    test-id="ai-chat-dialog"
    :rect="hariPanelRect"
    :on-rect-change="config.setHariPanelRect"
    #default="{ startDrag }"
  >
    <HariPanel :start-drag="startDrag" :on-close="close" />
  </FloatingPanel>
</template>
