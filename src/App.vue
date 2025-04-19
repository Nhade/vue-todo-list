<script setup>
import { ref } from 'vue'
import AlertBox from './components/AlertBox.vue'
import BaseButton from './components/BaseButtons.vue'
import TaskMenu from './components/TaskMenu.vue'
import TaskInlineForm from './components/TaskInlineForm.vue'

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
    <h1>Basic Todo List</h1>
    <AlertBox ref="alertRef" />
    <BaseButton variant="primary" @click="toggleSidebar">Toggle Sidebar</BaseButton>
    <TaskMenu @alert="(msg) => showAlert(msg)" />
    <TaskInlineForm @cancel="toggleSidebar" @alert="(msg) => showAlert(msg)" @saved="toggleSidebar"
      :sidebarOpen="sidebarOpen" />
  </div>
</template>

<style scoped></style>
