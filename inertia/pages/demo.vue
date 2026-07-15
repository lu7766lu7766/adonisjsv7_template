<script setup lang="ts">
import { ref } from 'vue'
import { Head } from '@inertiajs/vue3'

interface Task {
  id: number
  title: string
  isCompleted: boolean
}

// 範例資料狀態
const tasks = ref<Task[]>([
  { id: 1, title: '設定 API Format 中介軟體', isCompleted: true },
  { id: 2, title: '整合 Socket.IO 伺服器', isCompleted: true },
  { id: 3, title: '編寫 Task Migration 與 Seeder 範例', isCompleted: true },
  { id: 4, title: '啟動 Vite + Tailwind CSS 進行版面開發', isCompleted: false },
])

const newTaskTitle = ref('')

const addTask = () => {
  if (!newTaskTitle.value.trim()) return
  tasks.value.push({
    id: Date.now(),
    title: newTaskTitle.value.trim(),
    isCompleted: false,
  })
  newTaskTitle.value = ''
}

const toggleTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.isCompleted = !task.isCompleted
  }
}

const deleteTask = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}
</script>

<template>
  <Head title="AdonisJS 7 範例控制板" />

  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-lg bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700/50">
      <!-- 頂部標題與微小徽章 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          AGY 開發範例
        </h1>
        <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-700/50 text-cyan-400 border border-cyan-500/20">
          Inertia + Tailwind
        </span>
      </div>

      <!-- 開發說明 -->
      <p class="text-sm text-slate-400 mb-6 leading-relaxed">
        此頁面展示了基於 <span class="text-cyan-400 font-medium">Tailwind CSS</span> 打造的精美暗黑風介面。
        您可在本機運行此範例以測試 Inertia 數據渲染與前端互動。
      </p>

      <!-- 新增任務輸入框 -->
      <form @submit.prevent="addTask" class="flex gap-2 mb-6">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="新增一項待辦事項..."
          class="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
        />
        <button
          type="submit"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-semibold text-sm transition-all active:scale-95"
        >
          新增
        </button>
      </form>

      <!-- 任務列表 -->
      <div class="space-y-3">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/60 transition-all group"
        >
          <div class="flex items-center gap-3">
            <button
              @click="toggleTask(task.id)"
              type="button"
              class="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
              :class="[
                task.isCompleted
                  ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                  : 'border-slate-600 hover:border-slate-500'
              ]"
            >
              <svg
                v-if="task.isCompleted"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-3.5 h-3.5"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <span
              class="text-sm transition-all"
              :class="[task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200']"
            >
              {{ task.title }}
            </span>
          </div>

          <button
            @click="deleteTask(task.id)"
            type="button"
            class="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
