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

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects/users`);
  return response;
}

function selectProject() {
  selectedProject = projects.value.find(p => p._id === projectInSelect.value);
  getTasks();
}

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

async function updateTask(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/tasks/${data._id}`, 'PUT', JSON.stringify(data.task));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  taskForm.value.showHideForm()
  getTasks()
}

async function deleteTask(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/tasks/${data._id}`, 'DELETE');
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  taskForm.value.showHideForm()
  getTasks()
}

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
