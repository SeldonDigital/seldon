<script setup lang="ts">
import { createEmptyWorkspace } from "@seldon/core"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
  type StoredWorkspace,
} from "@lib/storage/workspace-store"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const workspaces = ref<StoredWorkspace[]>([])
const loading = ref(true)

async function refresh(): Promise<void> {
  loading.value = true
  workspaces.value = await listStoredWorkspaces()
  loading.value = false
}

async function create(): Promise<void> {
  const record = await createStoredWorkspace("Untitled", createEmptyWorkspace())
  router.push(`/${record.id}`)
}

function open(id: string): void {
  router.push(`/${id}`)
}

async function remove(id: string): Promise<void> {
  await deleteStoredWorkspace(id)
  await refresh()
}

onMounted(refresh)
</script>

<template>
  <main class="home">
    <h1>Seldon Editor (Vue)</h1>
    <p class="home-subtitle">
      Workspaces are stored on your machine and shared with the React editor.
    </p>

    <button class="home-create" @click="create">New workspace</button>

    <p v-if="loading" class="home-empty">Loading…</p>
    <p v-else-if="workspaces.length === 0" class="home-empty">
      No workspaces yet.
    </p>

    <ul v-else class="home-list">
      <li v-for="ws in workspaces" :key="ws.id" class="home-item">
        <button class="home-item__open" @click="open(ws.id)">
          <span class="home-item__name">{{ ws.name }}</span>
          <span class="home-item__meta">
            {{ ws.lastEditor ?? "?" }} · {{ ws.updatedAt }}
          </span>
        </button>
        <button class="home-item__delete" @click="remove(ws.id)">Delete</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.home {
  padding: 3rem;
  max-width: 720px;
  margin: 0 auto;
  color: #18181b;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.home-subtitle {
  color: #52525b;
}
.home-create {
  margin: 1rem 0 2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #18181b;
  color: #fff;
  cursor: pointer;
}
.home-empty {
  color: #a1a1aa;
}
.home-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.home-item {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}
.home-item__open {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  text-align: left;
}
.home-item__meta {
  font-size: 0.75rem;
  color: #a1a1aa;
}
.home-item__delete {
  padding: 0 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background: #fff;
  color: #b91c1c;
  cursor: pointer;
}
</style>
