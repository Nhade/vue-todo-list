<template>
    <div class="menu">
        <div class="menu-container">
            <div class="menu-top">
                <span class="title-medium">Menu</span>
                <button class="icon-btn" @click="$emit('toggle-menu')">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                            d="M5 7h14M5 12h14M5 17h14" />
                    </svg>
                </button>
            </div>

            <div class="menu-by-date">
                <span class="title-small">Tasks</span>
                <div v-for="f in dateFilters" :key="f.id" :class="{ selected: f.id === selectedFilter }"
                    @click="selectFilter(f.id)">
                    <span class="icon-container" v-html="f.svg"></span>
                    <span class="label">{{ f.label }}</span>
                </div>
            </div>

            <div class="menu-by-list">
                <span class="title-small">Lists</span>
                <div v-for="lst in lists" :key="lst.name" :class="{ selected: lst.name === selectedList }"
                    @click="selectList(lst.name)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 24 24">
                        <rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="2" rx="4" ry="4" />
                    </svg>
                    <span>{{ lst.name }}</span>
                    <span v-if="lst.pendingCount > 0" class="notif-badge">
                        {{ lst.pendingCount }}
                    </span>
                </div>

                <div id="create-list-btn" v-if="!creating" @click="openCreate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M5 12h14m-7 7V5" />
                    </svg>
                    <span>Add New List</span>
                </div>

                <div id="create-list-form" v-if="creating">
                    <input ref="newListInput" v-model="newListName" type="text" placeholder="Enter List Name"
                        @keydown.enter.prevent="submitCreate" @keydown.esc.prevent="cancelCreate"
                        @blur="cancelCreate" />
                </div>
            </div>

            <div class="menu-bottom">
                <slot name="bottom"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
    lists: {
        type: Array,
        default: () => []
    },
    initialSelectedList: String,
    initialFilter: {
        type: String,
        default: 'upcoming'
    }
})

const emit = defineEmits([
    'toggle-menu',
    'change-filter',
    'change-list',
    'create-list',
    'alert'
])

const dateFilters = [
    {
        id: 'upcoming',
        label: 'Upcoming',
        svg: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
               height="24" fill="none" viewBox="4 2 14 21">
            <path stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="2"
                  d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
          </svg>`
    },
    {
        id: 'today',
        label: 'Today',
        svg: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
               height="24" fill="none" viewBox="2 2 21 21">
            <path stroke="currentColor" stroke-linecap="round"
                  stroke-width="2"
                  d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
          </svg>`
    },
    {
        id: 'past',
        label: 'Past',
        svg: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
               height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5"/>
          </svg>`
    }
]

const selectedFilter = ref(props.initialFilter)
const selectedList = ref(props.initialSelectedList || '')

const creating = ref(false)
const newListName = ref('')
const newListInput = ref(null)

function selectFilter(id) {
    selectedFilter.value = id
    emit('change-filter', id)
}

function selectList(name) {
    selectedList.value = name
    emit('change-list', name)
}

function openCreate() {
    creating.value = true
    nextTick(() => newListInput.value?.focus())
}

function cancelCreate() {
    creating.value = false
    newListName.value = ''
}

function submitCreate() {
    const name = newListName.value.trim()
    if (!name) {
        emit('alert', 'List name cannot be empty!')
        return
    }
    if (props.lists.some(l => l.name === name)) {
        emit('alert', 'A list with this name already exists!')
        return
    }
    emit('create-list', name)
    cancelCreate()
}
</script>

<style scoped>
.menu {
    position: fixed;
    display: flex;
    margin: 2rem 0;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 20vw;
}

.menu-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
    margin: 0 2rem;
    padding: 2rem;
    height: auto;
    width: inherit;
    border-radius: 1rem;
    background-color: hsl(0, 0%, 22%);
}

.menu-top {
    display: flex;
    align-items: center;

    button {
        height: 3rem;
        width: 3rem;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: hsla(0, 0%, 22%, 0);
        margin-left: auto;
        border-radius: 0.5rem;
        transition: 0.15s;
        cursor: pointer;

        &:hover {
            background-color: hsl(0, 0%, 46%);
        }
    }
}

.menu-by-date {
    text-align: left;

    div {
        cursor: pointer;
        display: flex;
        position: relative;
        align-items: center;
        padding: 0 0.5rem;
        height: 3rem;
        border-radius: 0.5rem;
        transition: 0.15s;

        &:hover {
            background-color: hsl(0, 0%, 46%);
        }

        .icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .label {
            position: absolute;
            left: 2.5rem;
        }

        .notif-badge {
            position: static;
            margin-left: auto;
        }
    }

    .selected {
        font-weight: 600;
        background-color: hsl(0, 0%, 86%);

        :not(.notif-badge) {
            color: hsl(0, 0%, 12%);
        }

        &:hover {
            background-color: hsl(0, 0%, 65%);
        }
    }
}

.menu-by-list {
    text-align: left;
    margin-bottom: auto;

    div {
        cursor: pointer;
        display: flex;
        position: relative;
        align-items: center;
        padding: 0 0.5rem;
        height: 3rem;
        border-radius: 0.5rem;
        transition: 0.15s;

        &:hover {
            background-color: hsl(0, 0%, 46%);
        }

        .icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .label {
            position: absolute;
            left: 2.5rem;
        }

        >span {
            position: absolute;
            left: 2.5rem;
        }

        .notif-badge {
            position: static;
            margin-left: auto;
        }
    }

    #create-list-form {
        background-color: hsl(0, 0%, 30%);

        input {
            all: unset;
            color: hsla(0, 0%, 100%, 86%);
            background-color: hsl(0, 0%, 16%);
            border: 2px solid hsl(0, 0%, 46%);
            height: 1.5rem;
            width: 100%;
            padding: 0 0.5rem;
            border-radius: 0.5rem;
            transition: 0.15s;

            &:focus,
            &:active {
                border: 2px solid #2e90fa;
                box-shadow: 0px 0px 0px 3px hsl(211, 95%, 58%, 30%);
            }
        }
    }

    .selected {
        font-weight: 600;
        background-color: hsl(0, 0%, 86%);

        :not(.notif-badge) {
            color: hsl(0, 0%, 12%);
        }

        &:hover {
            background-color: hsl(0, 0%, 65%);
        }
    }
}

.menu-bottom {
    justify-self: flex-end;
}

.notif-badge {
    width: 2rem;
    background-color: hsl(0, 70%, 60%);
    border-radius: 1rem;
    text-align: center;
}

#create-list-btn {
    &:hover {
        background-color: hsl(0, 0%, 46%);
        cursor: pointer;
    }
}
</style>
