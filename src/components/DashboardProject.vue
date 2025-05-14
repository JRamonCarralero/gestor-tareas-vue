<script setup>
import DashboardTask from './dashboardTask.vue'

const props = defineProps(['project'])
</script>

<template>
  <div class="dashboard-project">
    <p>{{ props.project.name }}</p>
    <ul>
      <li v-for="task in props.project.tasks" :key="task._id">
        <DashboardTask :task="task" />
      </li>
    </ul>
  </div>
</template>
