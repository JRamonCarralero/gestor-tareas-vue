<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { getAPIData } from '../utils/utils';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore()
const user = ref(null)

onMounted(async () => {
  user.value = authStore.user
  await getProjects()
})

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/filter/projects`, 'POST', JSON.stringify({ assignedTo: user.value._id }));
  console.log(response)
}
</script>

<template>
  <h2>Dashboard</h2>
</template>
