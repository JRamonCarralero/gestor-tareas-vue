<script setup>
import { ref, defineEmits } from 'vue';
import DashboardTask from './DashboardTask.vue'

const props = defineProps(['project'])
const emit = defineEmits(['update-task'])

const showMore = ref(false)

function updateTask(data) {
  data.projectId = props.project._id
  emit('update-task', data)
}
</script>

<template>
  <div class="dashboard-project">
    <div class="project-title">
      <h3>{{ props.project.name }}</h3>
      <div class="project-buttons">
        <button class="show-more" v-if="!showMore" @click="showMore = true">+</button>
        <button class="show-more" v-if="showMore" @click="showMore = false">-</button>
      </div>
    </div>
    <div v-if="showMore" class="project-data">
      <span><b>Inicio:</b>  {{ props.project.initialDate }}</span>
      <span><b>Final:</b>  {{ props.project.finalDate }}</span>
      <span><b>Estado:</b>  {{ props.project.status }}</span>
      <span><b>Prioridad:</b>  {{ props.project.priority }}</span>
      <div class="project-description">
        <p>{{ props.project.description }}</p>
      </div>
    </div>
    <ul class="project-tasks-list">
      <li class="project-task-item" v-for="task in props.project.tasks" :key="task._id">
        <DashboardTask :task="task" @update-task="updateTask" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dashboard-project {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0
}

.project-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.show-more {
  width: 30px;
  height: 30px;
  background-color: #008CBA;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.project-data {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 0.5rem;
}

.project-description {
  width: 100%;
}

.project-tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-task-item + .project-task-item {
  margin-top: 15px;
}
</style>
