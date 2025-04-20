<template>
    <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-content">
            <span class="title-medium">Add Task</span>

            <input type="text" v-model="taskName" placeholder="Task Name" id="task-name" />

            <textarea v-model="taskDescription" placeholder="Task Description"></textarea>

            <div class="task-datetime-container">
                <span>Due date</span>
                <input type="date" v-model="dueDate" />
                <input type="number" min="0" max="23" v-model.number="dueHour" />
                <span>:</span>
                <input type="number" min="0" max="59" v-model.number="dueMinute" />
            </div>

            <div class="task-priority-container">
                <span>Priority</span>
                <div class="dropdown" :class="{ 'dropdown-open': dropdownOpen }">
                    <BaseButton variant="tertiary" @click="toggleDropdown">
                        <span>{{ selectedPriority }}</span>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                            viewBox="0 0 24 24" :class="{ 'rotate-180': dropdownOpen }">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m8 10 4 4 4-4" />
                        </svg>
                    </BaseButton>
                    <div class="dropdown-container" v-if="dropdownOpen">
                        <div class="option" v-for="p in priorities" :key="p" @click="selectPriority(p)">
                            {{ p }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="sidebar-button-container">
                <BaseButton variant="secondary" @click="onCancel"> Cancel</BaseButton>
                <BaseButton variant="primary" @click="onSave"> Save Task </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useTodoStore } from "../stores/useTodoStore"
import BaseButton from "./BaseButtons.vue"

const todo = useTodoStore()

const emit = defineEmits(["cancel", "saved", "alert"])
const props = defineProps({
    sidebarOpen: Boolean
})

const taskName = ref("")
const taskDescription = ref("")
const dueDate = ref("")
const dueHour = ref(0)
const dueMinute = ref(0)

const priorities = ["Urgent", "Very High", "High", "Medium", "Low"]
const selectedPriority = ref("Select Priority")
const dropdownOpen = ref(false)

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value
}

function selectPriority(priority) {
    selectedPriority.value = priority
    dropdownOpen.value = false
}

function onSave() {
    const name = taskName.value.trim()

    if (!todo.currentList) {
        emit("alert", "Please create a list first!")
        return
    }
    if (!name) {
        emit("alert", "Task name cannot be empty!")
        return
    }
    if (todo.currentTasks.some(t => t.name === name)) {
        emit("alert", "A task with this name already exists!")
        return
    }

    if (
        !(
            dueHour.value >= 0 &&
            dueHour.value <= 23 &&
            dueMinute.value >= 0 &&
            dueMinute.value <= 59
        )
    ) {
        emit("alert", "Invalid time!")
        return
    }
    if (selectedPriority.value === "Select Priority") {
        emit("alert", "Please select a priority!")
        return
    }

    try {
        const [y, m, d] = dueDate.value.split("-").map(Number)
        const datetime = new Date(y, m - 1, d, dueHour.value, dueMinute.value)
        const task = {
            name,
            description: taskDescription.value,
            due: datetime,
            priority: selectedPriority.value
        }

        todo.addTask(task)

        taskName.value = ""
        taskDescription.value = ""
        dueDate.value = ""
        dueHour.value = 0
        dueMinute.value = 0
        selectedPriority.value = "Select Priority"

        emit("saved", task)
    } catch (e) {
        if (e instanceof RangeError) {
            emit("alert", "Invalid date!")
        } else {
            emit("alert", "Something went wrong, please try again.")
            console.error(e)
        }
    }
}

function onCancel() {
    emit("cancel")
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    display: flex;
    z-index: 1;
    margin: 2rem 0;
    height: auto;
    right: -30vw;
    top: 0px;
    bottom: 0px;
    width: 30vw;
    transition: 0.3s;
}

.sidebar-open {
    right: 0px;
}

.sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
    background-color: hsl(0, 0%, 22%);
    color: hsla(0, 0%, 100%, 86%);
    height: auto;
    width: 100%;
    margin: 0px 2rem;
    padding: 2rem;
    border-radius: 2rem;
    box-sizing: border-box;
}


.sidebar-content input,
.sidebar-content textarea {
    all: unset;
    box-sizing: border-box;
    color: hsla(0, 0%, 100%, 86%);
    background-color: hsl(0, 0%, 16%);
    border: 2px solid hsl(0, 0%, 46%);
    border-radius: 0.5rem;
    padding: 0 0.5rem;
    transition: 0.15s;
}

.sidebar-content input:focus,
.sidebar-content input:active,
.sidebar-content textarea:focus,
.sidebar-content textarea:active {
    border: 2px solid #2e90fa;
    box-shadow: 0px 0px 0px 3px hsl(211, 95%, 58%, 30%);
}

.sidebar-content input:invalid,
.sidebar-content textarea:invalid {
    border: 2px solid #ee4342;
    box-shadow: 0px 0px 0px 3px hsla(0, 83%, 60%, 30%);
}

.sidebar-content input#task-name {
    height: 3rem;
    width: auto;
    text-align: left;
}

.sidebar-content textarea {
    height: 8rem;
    resize: none;
    text-align: left;
    padding: 0.5rem;
}

.task-datetime-container {
    display: flex;
    gap: 0.5rem;
    justify-items: flex-end;
    align-items: center;
}

.task-datetime-container span:first-of-type {
    flex: 1;
    width: max-content;
    justify-self: flex-start;
    margin-right: auto;
}

.task-datetime-container input[type="date"] {
    height: 2rem;
    border-radius: 0.5rem;
    padding: 0 0.5rem;
}

.task-datetime-container input[type="number"] {
    height: 2rem;
    width: 4rem;
    border-radius: 0.5rem;
    padding: 0 0.5rem;
}

.task-priority-container {
    display: flex;
    align-items: center;
}

.task-priority-container span {
    margin-right: auto;
}

.task-priority-container input {
    justify-self: flex-end;
    height: 2rem;
    border-radius: 0.5rem;
    padding: 0 0.5rem;
}

.sidebar-button-container {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 1rem;
    margin-top: auto;
    flex: 1;
}

.sidebar-button-container button {
    height: 3rem;
    width: 100%;
}

.dropdown {
    position: relative;
}

.dropdown-container {
    position: absolute;
    padding: 0.25rem 0;
    top: calc(2.5rem+4px);
    left: 0px;
    width: 100%;
    background-color: hsl(0, 0%, 30%);
    border-radius: 0.5rem;
}

.dropdown-open:hover,
.dropdown-container:hover {
    button {
        border: 2px solid #2e90fa;
        box-shadow: 0px 0px 0px 3px hsl(211, 95%, 58%, 30%);
    }

    .dropdown-container {
        display: flex;
        flex-direction: column;
    }
}

.option {
    margin: 0 0.25rem;
    border-radius: 3px;
    height: 2rem;
    text-align: center;
    line-height: 2rem;

    &:hover {
        background-color: hsl(0, 0%, 46%);
        cursor: pointer;
    }
}

.dropdown svg {
    transition: 0.15s;
}

.rotate-180 {
    transform: rotate(-180deg);
}
</style>
