<script setup>
import { ref } from 'vue'
import BaseButton from './components/BaseButtons.vue'
import TaskMenu from './components/TaskMenu.vue'
import TaskInlineForm from './components/TaskInlineForm.vue'

const sidebarOpen = ref(false)
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div>
    <h1>Basic Todo List</h1>
    <BaseButton variant="primary" @click="toggleSidebar">Toggle Sidebar</BaseButton>
    <TaskMenu />
    <TaskInlineForm @cancel="toggleSidebar" :sidebarOpen="sidebarOpen" />
  </div>
</template>

<style scoped></style>
