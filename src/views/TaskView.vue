<script setup>
import TaskForm from '../components/TaskForm.vue';
import { ref, onMounted } from 'vue';
import { getAPIData } from '@/utils/utils';

const API_PORT = location.port ? `:3333` : ''

const projects = ref([]);
const projectInSelect = ref(null);
let selectedProject = null;

onMounted(async () => {
  projects.value = await getProjects();
  console.log('projects', projects.value);
});

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects`);
  return response;
}

function selectProject() {
  selectedProject = projects.value.find(p => p._id === projectInSelect.value);
  console.log('selectedProject', selectedProject);
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
  <div class="view-container">
    <div class="view-form-container">
      <TaskForm />
    </div>
    <div class="view-list-container">
      <!--<TaskList />-->
    </div>
  </div>
</template>
