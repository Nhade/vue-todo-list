<script setup>
import { computed, ref } from 'vue'
import { useTodoStore } from './stores/useTodoStore'
import AlertBox from './components/AlertBox.vue'
import BaseButton from './components/BaseButtons.vue'
import TaskMenu from './components/TaskMenu.vue'
import TaskInlineForm from './components/TaskInlineForm.vue'

const todo = useTodoStore()
todo.load()

const sidebarOpen = ref(false)
const alertRef = ref()
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function showAlert(msg) {
  alertRef.value.showAlert(msg)
}

const menuLists = computed(() =>
  todo.lists.map(l => ({
    name: l.name,
    pendingCount: todo.pendingCount(l.name)
  }))
)

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
</script>

<template>
  <div>
    <h1>Basic Todo List</h1>
    <AlertBox ref="alertRef" />
    <BaseButton variant="primary" @click="toggleSidebar">Toggle Sidebar</BaseButton>
    <TaskMenu :lists="menuLists" :initial-selected-list="todo.currentList" :initial-filter="todo.filterByDate"
      @change-filter="handleFilter" @change-list="handleSelectList" @create-list="handleCreateList"
      @alert="(msg) => showAlert(msg)" />
    <TaskInlineForm @cancel="toggleSidebar" @alert="(msg) => showAlert(msg)" @saved="toggleSidebar"
      :sidebarOpen="sidebarOpen" />
  </div>
</template>

<style scoped></style>
