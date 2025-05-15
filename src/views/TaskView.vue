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
 * If checking dates fails, shows an alert.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the tasks list.
 * @param {Object} task - The task data to create, including its project ID.
 * @returns {Promise<void>}
 */
async function createTask(task) {
  if (!checkTaskDates(task.initialDate, task.finalDate)) {
    alert('Las fechas de la tarea deben estar en el rango de fechas del proyecto')
    return
  }
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
 * If checking dates fails, shows an alert.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the tasks list.
 * @param {Object} data - an object containing the task id to update and the task data to update
 * @returns {Promise<void>}
 */
async function updateTask(data) {
  if (!checkTaskDates(data.task.initialDate, data.task.finalDate)) {
    alert('Las fechas de la tarea deben estar en el rango de fechas del proyecto')
    return
  }
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

/**
 * Checks if the given initial and final dates for a task are within the dates of the selected project.
 * @param {string} initialDate - the initial date of the task
 * @param {string} finalDate - the final date of the task
 * @returns {boolean} true if the dates are within the project dates, false if not.
 */
function checkTaskDates(initialDate, finalDate) {
  if (initialDate < selectedProject.initialDate || finalDate > selectedProject.finalDate) {
    return false
  } else {
    return true
  }
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Tareas</h2>
  </div>
  <div class="view-filter-container">
    <label for="select-project">Seleccione un proyecto:</label>
    <select id="select-project" v-model="projectInSelect">
      <option v-for="project in projects" :key="project._id" :value="project._id">{{ project.name }}</option>
    </select>
    <button id="btn-filter" class="btn-filter" @click="selectProject()">Elegir</button>
  </div>
  <div v-if="selectedProject" class="view-container border-bottom">
    <h3>Proyecto: {{ selectedProject.name }}</h3>
    <div class="info-items">
      <span><b>Fecha inicio:</b> {{ selectedProject.initialDate }}</span>
      <span><b>Fecha final:</b> {{ selectedProject.finalDate }}</span>
      <span><b>Estado:</b> {{ selectedProject.status }}</span>
      <span><b>Prioridad:</b> {{ selectedProject.priority }}</span>
    </div>
    <p>{{ selectedProject.description }}</p>
  </div>
  <div class="view-container">
    <div class="view-list-container">
      <TaskList :tasks="tasks" @select-task="(task) => selectTask(task)" />
    </div>
    <div v-if="selectedProject" class="view-form-container">
      <TaskForm ref="taskForm" :project="selectedProject" @create-task="createTask" @update-task="updateTask" @delete-task="deleteTask" />
    </div>
  </div>
</template>

<style scoped>
.view-filter-container {
  width: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 20px;
  gap: 10px;
  border-bottom: 1px solid #ccc;
}

.btn-filter {
  width: 200px;
  padding: 7px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  background-color: #008CBA;
  color: white;

  &:hover {
    cursor: pointer;
  }
}

.info-items {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin: 20px auto 10px;
}
</style>
