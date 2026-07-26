<script setup lang="ts">
import { createEmptyWorkspace } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
  type StoredWorkspace,
} from "@seldon/editor/lib/storage/workspace-store"
import { useToastStore } from "@app/toaster/toast-store"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const toast = useToastStore()
const workspaces = ref<StoredWorkspace[]>([])
const loading = ref(true)
const fileInput = ref<HTMLInputElement | null>(null)

async function refresh(): Promise<void> {
  loading.value = true
  workspaces.value = await listStoredWorkspaces()
  loading.value = false
}

async function create(): Promise<void> {
  const record = await createStoredWorkspace(
    HOME_CONTENT.defaultWorkspaceName,
    createEmptyWorkspace(),
  )
  router.push(`/${record.id}`)
}

function open(id: string): void {
  router.push(`/${id}`)
}

async function remove(id: string): Promise<void> {
  if (!confirm(HOME_CONTENT.deleteConfirm)) return
  await deleteStoredWorkspace(id)
  await refresh()
}

async function duplicate(record: StoredWorkspace): Promise<void> {
  await createStoredWorkspace(`${record.name} copy`, record.workspace)
  await refresh()
}

function triggerImport(): void {
  fileInput.value?.click()
}

async function onImportFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return
  try {
    const parsed = JSON.parse(await file.text()) as
      | Partial<StoredWorkspace>
      | Workspace
    const workspace = ((parsed as Partial<StoredWorkspace>).workspace ??
      parsed) as Workspace
    if (!workspace || typeof workspace !== "object" || !("nodes" in workspace)) {
      toast.addToast("Invalid workspace file")
      return
    }
    const name =
      (parsed as Partial<StoredWorkspace>).name ??
      file.name.replace(/\.json$/i, "")
    const record = await createStoredWorkspace(name, workspace)
    router.push(`/${record.id}`)
  } catch {
    toast.addToast("Could not read workspace file")
  }
}

onMounted(refresh)
</script>

<template>
  <main class="home">
    <h1 class="home-title">{{ HOME_CONTENT.title }}</h1>
    <p class="home-subtitle">{{ HOME_CONTENT.subtitle("React") }}</p>

    <div class="home-actions">
      <button class="home-create" @click="create">
        {{ HOME_CONTENT.newWorkspaceButton }}
      </button>
      <button class="home-import" @click="triggerImport">
        {{ HOME_CONTENT.openWorkspaceButton }}
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="home-file"
        @change="onImportFile"
      />
    </div>

    <h2 class="home-section-title">
      {{ HOME_CONTENT.recentWorkspacesHeading }}
    </h2>
    <p v-if="loading" class="home-empty">{{ HOME_CONTENT.loading }}</p>
    <p v-else-if="workspaces.length === 0" class="home-empty">
      {{ HOME_CONTENT.noWorkspaces }}
    </p>

    <ul v-else class="home-list">
      <li v-for="ws in workspaces" :key="ws.id" class="home-item">
        <button class="home-item__open" @click="open(ws.id)">
          <span class="home-item__name">{{ ws.name }}</span>
          <span class="home-item__meta">
            {{ ws.lastEditor ?? "?" }} · {{ ws.updatedAt }}
          </span>
        </button>
        <button class="home-item__action" @click="duplicate(ws)">
          Duplicate
        </button>
        <button class="home-item__delete" @click="remove(ws.id)">
          {{ HOME_CONTENT.deleteButton }}
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.home {
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-width: 42rem;
  flex-direction: column;
  gap: 2rem;
  padding: 2.5rem;
  color: #fff;
}
.home-title {
  font-size: 1.25rem;
  font-weight: 600;
}
.home-subtitle {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.7);
}
.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.home-section-title {
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}
.home-create {
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  background: #fff;
  color: #000;
  border: none;
  cursor: pointer;
}
.home-import {
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.home-file {
  display: none;
}
.home-item__action {
  padding: 0 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}
.home-empty {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
}
.home-list {
  list-style: none;
  padding: 0;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.home-item {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}
.home-item + .home-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.home-item__open {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}
.home-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}
.home-item__meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}
.home-item__delete {
  padding: 0 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  cursor: pointer;
}
.home-item__delete:hover {
  color: #fff;
}
</style>
