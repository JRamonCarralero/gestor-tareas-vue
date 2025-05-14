<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { getAPIData } from '../utils/utils';
import DashboardProject from '@/components/dashboardProject.vue';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore()
const user = ref(null)

const projects = ref([])

onMounted(async () => {
  user.value = authStore.user
  await getProjects()
})

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects/tasks`, 'POST', JSON.stringify({ assignedTo: user.value._id }));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projects.value = response.data
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Dashboard</h2>
  </div>
  <div class="view-container">
    <ul class="dashboard-list">
      <li class="dashboard-list-item" v-for="project in projects" :key="project._id">
        <DashboardProject :project="project" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dashboard-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
}

.dashboard-list-item {
  width: 100%;
  padding: 1rem;
}
</style>
