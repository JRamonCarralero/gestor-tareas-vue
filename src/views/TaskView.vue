<script setup>
import { ref, onMounted } from 'vue';
import { getAPIData } from '@/utils/utils';
import { useAuthStore } from '../stores/auth';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore();
const user = ref(null);

const projects = ref([]);

onMounted(async () => {
  projects.value = await getProjects();
  user.value = authStore.user;
});

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects`);
  return response;
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Tareas</h2>
  </div>
  <div class="view-filter-container">
    <label for="select-project">Proyectos:</label>
    <select id="select-project">
      <option v-for="project in projects" :key="project._id" :value="project._id">{{ project.name }}</option>
    </select>
  </div>
</template>
