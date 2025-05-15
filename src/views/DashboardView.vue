<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { getAPIData } from '../utils/utils';
import DashboardProject from '@/components/DashboardProject.vue';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore()
const user = ref(null)

const projects = ref([])

onMounted(async () => {
  user.value = authStore.user
  await getProjects()
})

/**
 * Fetches projects along with their tasks assigned to the current user from the server.
 * If the response is not OK, alerts the user with the response message.
 * If the response is OK, updates the local projects reactive reference with the response data.
 * @returns {Promise<void>}
 */
async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects/tasks`, 'POST', JSON.stringify({ assignedTo: user.value._id }));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projects.value = response.data
}

/**
 * Updates the status of a specific task within a project in the local projects data.
 * Finds the project with the given project ID and updates the task with the given task ID.
 * Sets the task's status to the new status provided in the data object.
 *
 * @param {Object} data - an object containing the projectId, taskId, and new status
 */
function updateTask(data) {
  projects.value = projects.value.map(project => {
    if (project._id === data.projectId) {
      project.tasks = project.tasks.map(task => {
        if (task._id === data.taskId) {
          task.status = data.status
        }
        return task
      })
    }
    return project
  })
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Dashboard</h2>
  </div>
  <div class="view-container">
    <ul class="dashboard-list">
      <li class="dashboard-list-item" v-for="project in projects" :key="project._id">
        <DashboardProject :project="project" @update-task="updateTask" />
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
