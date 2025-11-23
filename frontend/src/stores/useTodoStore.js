import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTodoStore = defineStore("todo", () => {
  // --- STATE ---

  /**
   * The main array of tasks fetched from the backend for the current project.
   * @type {import("vue").Ref<Array<object>>}
   */
  const tasks = ref([]);
  /**
   * The array of projects (lists).
   * @type {import("vue").Ref<Array<object>>}
   */
  const projects = ref([]);
  /**
   * The ID of the currently selected project.
   * @type {import("vue").Ref<String>}
   */
  const currentProjectId = ref("");
  /**
   * The currently selected date filter.
   * @type {import("vue").Ref<'upcoming' | 'today' | 'past' | 'all'>}
   */
  const dateFilterId = ref("all");

  /**
   * The base URL for the backend API.
   * @type {string}
   */
  const API_URL = "/api";

  // --- GETTERS ---

  /**
   * Computes the number of tasks that are not marked as done.
   * @type {import("vue").ComputedRef<number>}
   */
  const pendingCount = computed(
    () => tasks.value.filter((t) => !t.done).length
  );

  // --- ACTIONS ---

  /**
   * Fetches all projects from the backend. If no project is currently
   * selected, it selects the first one by default. If there are no
   * projects, it clears the task list.
   */
  async function fetchProjects() {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const fetchedProjects = await response.json();
      projects.value = fetchedProjects;

      const currentProjectExists = fetchedProjects.some(
        (p) => p.id === currentProjectId.value
      );

      if (!currentProjectExists && fetchedProjects.length > 0) {
        selectProject(fetchedProjects[0].id);
      } else if (fetchedProjects.length === 0) {
        currentProjectId.value = "";
        tasks.value = [];
      } else {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      projects.value = [];
      tasks.value = [];
      currentProjectId.value = "";
    }
  }

  /**
   * Adds a new project (list).
   * @param {string} name - The name of the new project.
   */
  async function addProject(name) {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to add project");
      const newProject = await response.json();
      projects.value.push(newProject);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  }

  /**
   * Sets the current project and fetches its associated tasks.
   * @param {string} projectId - The ID of the project to select.
   */
  async function selectProject(projectId) {
    currentProjectId.value = projectId;
    fetchTasks();
  }

  /**
   * Fetches tasks for the currently selected project from the backend
   * and populates the state.
   */
  async function fetchTasks() {
    if (currentProjectId.value) {
      const url = new URL(`${API_URL}/todos`, window.location.origin);
      url.searchParams.append("project_id", currentProjectId.value);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        tasks.value = await response.json();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    } else {
      tasks.value = [];
      console.error("No project selected");
    }
  }

  /**
   * Adds a new task to the current project.
   * @param {object} taskData - The task data { name, description, due, priority }.
   */
  async function addTask(taskData) {
    if (!currentProjectId.value) {
      console.error("No project selected");
      return;
    }
    taskData.project_id = currentProjectId.value;
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to add task");
      const newTask = await response.json();
      tasks.value.push(newTask);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  /**
   * Removes a task by its ID.
   * @param {string} taskId - The UUID of the task to remove.
   */
  async function removeTask(taskId) {
    try {
      const response = await fetch(`${API_URL}/todos/${taskId}`, {
        method: "DELETE",
      });
      if (response.status !== 204) throw new Error("Failed to delete task");
      tasks.value = tasks.value.filter((t) => t.id !== taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  /**
   * Updates a task with new data.
   * @param {string} taskId - The UUID of the task to update.
   * @param {object} updateData - The fields to update (e.g., { done: true } or { name: "New name" }).
   */
  async function updateTask(taskId, updateData) {
    try {
      const response = await fetch(`${API_URL}/todos/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updatedTask = await response.json();
      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  /**
   * A convenience action to toggle the 'done' status of a task.
   * @param {string} taskId - The UUID of the task to toggle.
   */
  function toggleDone(taskId) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, { done: !task.done });
    }
  }

  /**
   * Sets the date filter for tasks. If the same filter is clicked again,
   * it will be deselected (reverting to "all").
   * @param {'upcoming' | 'today' | 'past' | 'all'} id - The filter identifier.
   */
  function setDateFilter(id) {
    if (dateFilterId.value === id) {
      dateFilterId.value = "all";
    } else {
      dateFilterId.value = id;
    }
  }

  // --- EXPORTS ---
  // Expose the state, getters, and actions for components to use.
  return {
    tasks,
    pendingCount,
    projects,
    currentProjectId,
    dateFilterId,
    setDateFilter,
    fetchProjects,
    addProject,
    selectProject,
    fetchTasks,
    addTask,
    removeTask,
    updateTask,
    toggleDone,
  };
});
