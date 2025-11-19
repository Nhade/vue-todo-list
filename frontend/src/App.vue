<script setup>
import { ref } from 'vue'
import { useTodoStore } from './stores/useTodoStore'
import AlertBox from './components/AlertBox.vue'
import BaseButton from './components/BaseButtons.vue'
import TaskMenu from './components/TaskMenu.vue'
import TaskInlineForm from './components/TaskInlineForm.vue'
import TaskList from './components/TaskList.vue'

const todo = useTodoStore()
todo.fetchProjects()

const sidebarOpen = ref(false)
const alertRef = ref()
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function showAlert(msg) {
  alertRef.value.showAlert(msg)
}

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
    <TaskMenu @alert="(msg) => showAlert(msg)" @toggle-menu="toggleSidebar" />
    <TaskInlineForm @cancel="toggleSidebar" @alert="(msg) => showAlert(msg)" @saved="toggleSidebar"
      :sidebarOpen="sidebarOpen" />
  </div>
</template>

<style scoped></style>
