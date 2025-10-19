<template>
    <transition name="fade">
        <div v-if="visible" :key="key" class="alert-box">
            {{ message }}
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')
const visible = ref(false)
let timer = null

// re-render hack
const key = ref(0)

function showAlert(msg) {
    if (timer) clearTimeout(timer)
    message.value = msg
    visible.value = true
    key.value++
    timer = setTimeout(() => {
        visible.value = false
        // timer = null
    }, 2900)
}

defineExpose({ showAlert })
</script>

<style scoped>
.alert-box {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 85vh;
    width: max-content;
    height: 4rem;
    text-align: center;
    line-height: 4rem;
    border-radius: 1rem;
    max-width: 100vw;
    max-height: 100vh;
    padding: 0 1rem;
    margin: auto;
    background-color: hsla(0, 70%, 70%, 100%);
    color: hsla(0, 0%, 12%, 100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: 0.3s;
}

.fade-enter-from {
    opacity: 0;
    bottom: 90vh;
}

.fade-enter-to {
    opacity: 1;
    bottom: 85vh;
}

.fade-leave-to {
    opacity: 0;
    bottom: 85vh;
}
</style>
