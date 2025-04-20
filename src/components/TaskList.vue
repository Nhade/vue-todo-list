<template>
    <ul class="task-list">
        <li v-for="task in tasksToShow" :key="task.id" :class="{ active: task.done }">
            <div class="primary-row">
                <input type="checkbox" :checked="task.done" @change="toggleDone(task.id)" />
                <span>{{ task.name }}</span>
                <BaseButtons variant="secondary" @click="todo.removeTask(task.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M5 12h14" />
                    </svg>
                </BaseButtons>
            </div>

            <div class="secondary-row">
                <span>{{ task.priority }}</span>
                <span v-if="task.description">{{ task.description }}</span>
                <span>{{ formatDue(task.due) }}</span>
            </div>
        </li>
        <li v-if="!tasksToShow.length" class="no-tasks-message">
            No tasks found for the selected filter.
        </li>
    </ul>
</template>

<script setup>
import { computed } from 'vue'
import { useTodoStore } from '../stores/useTodoStore'
import { parseISO, format, isToday, isPast, isFuture, formatDistanceToNow } from 'date-fns'
import BaseButtons from './BaseButtons.vue'

const todo = useTodoStore()

const tasksToShow = computed(() => {
    const raw = todo.currentTasks
    const filter = todo.filterByDate
    if (!filter) return raw

    return raw.filter(t => {
        try {
            const date = parseISO(t.due)
            switch (filter) {
                case 'today':
                    return isToday(date)
                case 'past':
                    return isPast(date)
                case 'upcoming':
                default:
                    return isFuture(date)
            }
        } catch (e) {
            console.error(`Invalid date on task "${t.name}": ${t.due}`, e)
            return false
        }
    })
})

function toggleDone(id) {
    todo.toggleDone(id)
}

function formatDue(iso) {
    try {
        const date = parseISO(iso)
        const full = format(date, 'yyyy/MM/dd HH:mm')
        const rel = formatDistanceToNow(date, { addSuffix: true })
        return `${full}, ${rel}`
    } catch (e) {
        console.error(`Date format error on ${iso}`, e)
        return "Invalid date"
    }
}
</script>

<style scoped>
.task-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    color: hsla(0, 0%, 100%, 0.86);
    min-width: 20rem;
    max-width: 45rem;
}

li {
    background-color: hsl(0, 0%, 22%);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 2px solid hsl(0, 0%, 30%);
    transition: 0.15s;
}

li:hover:not(.no-tasks-message) {
    background-color: hsl(0, 0%, 28%);
}

.primary-row {
    display: flex;
    align-items: center;
    text-align: left;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

input[type="checkbox"] {
    border: 2px solid hsla(0, 0%, 100%, 30%);
    background-color: hsla(0, 0%, 100%, 86%);
    height: 1.2rem;
    width: 1.2rem;
    cursor: pointer;
    accent-color: hsla(142, 55%, 45%, 100%);
}

.primary-row span {
    font-size: 1.2rem;
    cursor: default;
    word-break: break-word;
}

.primary-row .btn-secondary {
    padding: 0;
    min-width: 2rem;
    height: 2rem;
    margin-left: auto;
}

.secondary-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    font-size: 0.8rem;
    color: hsl(0, 0%, 70%);
    padding-left: calc(1.2rem + 0.5rem);
}

.secondary-row span {
    background-color: hsl(0, 0%, 30%);
    padding: 0.1rem 0.4rem;
    border-radius: 0.25rem;
    white-space: nowrap;
}

li.active {
    opacity: 0.7;
    background-color: hsl(0, 0%, 18%);
    border-color: hsl(0, 0%, 25%);

    .primary-row {
        span {
            text-decoration: line-through;
            color: hsla(142, 55%, 45%, 0.6);
            word-break: break-word;
        }

        button {
            opacity: 0.6;
        }
    }

    .secondary-row {
        opacity: 0.6;
    }
}

li.active:hover:not(.no-tasks-message) {
    background-color: hsl(0, 0%, 20%);
    opacity: 0.75;
}


.no-tasks-message {
    text-align: center;
    color: hsl(0, 0%, 70%);
    background-color: transparent;
    border: none;
    padding: 1rem;
}
</style>
