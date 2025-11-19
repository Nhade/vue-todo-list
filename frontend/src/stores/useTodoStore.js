import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTodoStore = defineStore("todo", () => {
  // --- STATE ---

  /**
   * The main array of tasks fetched from the backend.
   * @type {import("vue").Ref<Array<object>>}
   */
  const tasks = ref([]);
  const projects = ref([]);
  const currentProjectId = ref("");
  const dateFilterId = ref("upcoming");

  /**
   * The base URL for the backend API.
   * @type {string}
   */
  const API_URL = "http://localhost:8000";

  // --- GETTERS ---

  /**
   * Computes the number of tasks that are not marked as done.
   * @type {import("vue").ComputedRef<number>}
   */
  const pendingCount = computed(
    () => tasks.value.filter((t) => !t.done).length
  );

  // --- ACTIONS ---

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

  async function selectProject(projectId) {
    currentProjectId.value = projectId;
    fetchTasks();
  }

  /**
   * Fetches all tasks from the backend and populates the state.
   * Should be called when the application initializes.
   */
  async function fetchTasks() {
    if (currentProjectId.value) {
      const url = new URL(`${API_URL}/todos`);
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
   * Adds a new task.
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

  function setDateFilter(id) {
    dateFilterId.value = id;
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
