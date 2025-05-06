<script setup>
import { ref, onMounted } from 'vue';
import { getAPIData } from '@/utils/utils';
import { useAuthStore } from '../stores/auth';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore();
const user = ref(null);

const projects = ref([]);
const selectedProject = ref(null);
const usersAssigned = ref([]);
const usersNotAssigned = ref([]);

onMounted(async () => {
  projects.value = await getProjects();
  user.value = authStore.user;
});

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects`);
  return response;
}

function getProjectById(id) {
  return projects.value.find(project => project._id === id);
}

async function checkAssigned() {
  const allUsers = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/users`);
  const currentProject = getProjectById(selectedProject.value);
  console.log('currentProject', currentProject);
  if (currentProject) {
    console.log('selectedProject', currentProject);
    allUsers.forEach(user => {
      if (currentProject.assignedTo.includes(user._id)) {
        usersAssigned.value.push(user);
      } else {
        usersNotAssigned.value.push(user);
      }
    })
  }
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Tareas</h2>
  </div>
  <div class="view-filter-container">
    <label for="select-project">Proyectos:</label>
    <select id="select-project" v-model="selectedProject">
      <option v-for="project in projects" :key="project._id" :value="project._id">{{ project.name }}</option>
    </select>
    <button id="btn-filter" @click="checkAssigned()">Filtrar</button>
  </div>
  <div class="view-task-container">
    <div class="view-assigned-container">
      <h3 class="view-assigned-title">Asignadas</h3>
      <div class="view-assigned-list-container">
        <select id="select-assigned">
          <option v-for="user in usersNotAssigned" :key="user._id" :value="user._id">{{ user.name }}</option>
        </select>
        <button id="btn-assign">Asignar</button>
        <ul id="assigned-list">
          <li v-for="user in usersAssigned" :key="user._id" :value="user._id">{{ user.name }}</li>
        </ul>
      </div>
    </div>
    <div class="view-container">
      <div class="view-form-container">
        <!--<TaskForm />-->
      </div>
      <div class="view-list-container">
        <!--<TaskList />-->
      </div>
    </div>
  </div>
</template>
