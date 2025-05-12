<script setup>
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';
import { ref, onMounted, useTemplateRef } from 'vue';
import { getAPIData } from '@/utils/utils';

const API_PORT = location.port ? `:3333` : ''

const taskForm = useTemplateRef('taskForm');

const projects = ref([]);
const projectInSelect = ref(null);
const tasks = ref([]);
let selectedProject = null;

onMounted(async () => {
  projects.value = await getProjects();
});

/**
 * Gets all projects from the server, including the associated users.
 * @returns {Promise<Object[]>} an array of project objects, each containing the project data and the associated users
 */
async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects/users`);
  return response;
}

/**
 * Selects a project based on the selected project ID from the dropdown.
 * Sets the selected project as the active project and fetches the tasks
 * associated with the selected project.
 */
function selectProject() {
  selectedProject = projects.value.find(p => p._id === projectInSelect.value);
  getTasks();
}

/**
 * Gets all tasks for the currently selected project.
 * If no project is selected, alerts the user and returns.
 * If the response is not OK, alerts the user with the response message.
 * Otherwise, sets the tasks reactive reference to the response data.
 */
async function getTasks() {
  if (!selectedProject) {
    alert('Please select a project')
    return
  }
  const filter = {
    projectId: selectedProject._id
  }
  const payload = JSON.stringify(filter);
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/filter/tasks`, 'POST', payload);
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  tasks.value = response.data
}

/**
 * Creates a new task in the server for the selected project.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the tasks list.
 * @param {Object} task - The task data to create, including its project ID.
 * @returns {Promise<void>}
 */
async function createTask(task) {
  task.projectId = selectedProject._id;
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/tasks`, 'POST', JSON.stringify(task));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  taskForm.value.showHideForm()
  getTasks()
}

/**
 * Updates a task in the server.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the tasks list.
 * @param {Object} data - an object containing the task id to update and the task data to update
 * @returns {Promise<void>}
 */
async function updateTask(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/tasks/${data._id}`, 'PUT', JSON.stringify(data.task));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  taskForm.value.showHideForm()
  getTasks()
}

  /**
   * Deletes a task from the server.
   * If the response is not OK, shows an alert with the response message.
   * If the response is OK, clears the form and updates the tasks list.
   * @param {Object} data - an object containing the task id to delete
   * @returns {Promise<void>}
   */
async function deleteTask(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/tasks/${data._id}`, 'DELETE');
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  taskForm.value.showHideForm()
  getTasks()
}

/**
 * Populates the task form with the selected task data.
 * @param {Object} task - the task object to populate the form with
 */
function selectTask(task) {
  taskForm.value.selectTask(task)
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Tareas</h2>
  </div>
  <div class="view-filter-container">
    <label for="select-project">Proyectos:</label>
    <select id="select-project" v-model="projectInSelect">
      <option v-for="project in projects" :key="project._id" :value="project._id">{{ project.name }}</option>
    </select>
    <button id="btn-filter" @click="selectProject()">Elegir</button>
  </div>
  <div v-if="selectedProject" class="info-container">
    <h3>Proyecto: {{ selectedProject.name }}</h3>
    <p>Fecha inicio: {{ selectedProject.initialDate }}</p>
    <p>Fecha final: {{ selectedProject.finalDate }}</p>
    <p>Descripción: {{ selectedProject.description }}</p>
  </div>
  <div class="view-container">
    <div class="view-form-container">
      <TaskForm ref="taskForm" :project="selectedProject" @create-task="createTask" @update-task="updateTask" @delete-task="deleteTask" />
    </div>
    <div class="view-list-container">
      <TaskList :tasks="tasks" @select-task="(task) => selectTask(task)" />
    </div>
  </div>
</template>
