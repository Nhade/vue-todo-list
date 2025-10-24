<script setup>
import { computed, ref } from 'vue'
import { useTodoStore } from './stores/useTodoStore'
import AlertBox from './components/AlertBox.vue'
import BaseButton from './components/BaseButtons.vue'
import TaskMenu from './components/TaskMenu.vue'
import TaskInlineForm from './components/TaskInlineForm.vue'
import TaskList from './components/TaskList.vue'

const todo = useTodoStore()
todo.fetchTasks()

const sidebarOpen = ref(false)
const alertRef = ref()
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function showAlert(msg) {
  alertRef.value.showAlert(msg)
}

const menuLists = computed(() => [
  {
    name: 'Default',
    pendingCount: todo.pendingCount
  }
])

/*
function handleCreateList(name) {
  todo.addList(name)
  todo.selectList(name)
}

function handleSelectList(name) {
  todo.selectList(name)
}

function handleFilter(f) {
  todo.setDateFilter(f)
}
*/
</script>

<template>
  <div>
    <h1>Todo List</h1>
    <AlertBox ref="alertRef" />
    <BaseButton variant="primary" @click="sidebarOpen = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
          d="M5 12h14m-7 7V5" />
      </svg>
      Add New Task
    </BaseButton>
    <TaskList />
    <TaskMenu :lists="menuLists" @alert="(msg) => showAlert(msg)" />
    <TaskInlineForm @cancel="toggleSidebar" @alert="(msg) => showAlert(msg)" @saved="toggleSidebar"
      :sidebarOpen="sidebarOpen" />
  </div>
</template>

<style scoped></style>
