<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { getAPIData } from '../utils/utils';

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
  <h2>Dashboard</h2>
  <ul>
    <li v-for="project in projects" :key="project._id">
      {{ project.name }}
      <ul>
        <li v-for="task in project.tasks" :key="task._id">
          {{ task.name }}
        </li>
      </ul>
    </li>
  </ul>
</template>
