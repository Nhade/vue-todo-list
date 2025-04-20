import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { v4 as uuid } from "uuid";

export const useTodoStore = defineStore("todo", () => {
  const lists = ref([]); // [{ name, tasks: [ … ] }]
  const currentList = ref(""); // active list name
  const filterByDate = ref("upcoming"); // 'upcoming' | 'today' | 'past'

  function load() {
    const raw = localStorage.getItem("vue-todos");
    if (raw) {
      const data = JSON.parse(raw);
      lists.value = data.lists ?? [];
      currentList.value = data.currentList ?? "";
      filterByDate.value = data.filterByDate ?? "upcoming";
    }
  }
  function save() {
    localStorage.setItem(
      "vue-todos",
      JSON.stringify({
        lists: lists.value,
        currentList: currentList.value,
        filterByDate: filterByDate.value,
      })
    );
  }
  watch([lists, currentList, filterByDate], save, { deep: true });

  const pendingCount = (name) => {
    const l = lists.value.find((x) => x.name === name);
    return l ? l.tasks.filter((t) => !t.done).length : 0;
  };

  const currentTasks = computed(() => {
    const l = lists.value.find((x) => x.name === currentList.value);
    return l ? l.tasks : [];
  });

  function addList(name) {
    lists.value.push({ name, tasks: [] });
  }

  function selectList(name) {
    currentList.value = name;
  }

  function setDateFilter(f) {
    filterByDate.value = f;
  }

  function addTask({ name, description, due, priority }) {
    const l = lists.value.find((x) => x.name === currentList.value);
    if (!l) {
      console.log("No current list");
      return;
    }
    l.tasks.push({
      id: uuid(),
      name,
      description,
      due: due.toISOString(),
      priority,
      done: false,
    });
  }

  function toggleDone(taskId) {
    const l = lists.value.find((x) => x.name === currentList.value);
    const t = l?.tasks.find((x) => x.id === taskId);
    if (t) t.done = !t.done;
  }

  return {
    lists,
    currentList,
    filterByDate,
    currentTasks,
    pendingCount,
    load,
    addList,
    selectList,
    setDateFilter,
    addTask,
    toggleDone,
  };
});
