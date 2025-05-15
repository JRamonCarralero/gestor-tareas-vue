<script setup>
import { ref, defineEmits } from 'vue';
import { getAPIData } from '@/utils/utils';

const API_PORT = location.port ? `:3333` : ''

const props = defineProps(['task'])
const emit = defineEmits(['update-task'])

const showMore = ref(false)

async function updateTask(status) {
  const data = { status: status }
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/tasks/${props.task._id}`, 'PUT', JSON.stringify(data));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  emit('update-task', {taskId: props.task._id, status: status})
}
</script>

<template>
  <div class="dashboard-task">
    <div class="dashboard-task-main">
      <h4>{{ props.task.name }}</h4>
      <div class="dashboard-task-ps">
        <div :class="['task-priority', props.task.priority ]"></div>
        <span>{{ props.task.status }}</span>
      </div>
      <div class="task-buttons">
        <button class="show-more" v-if="!showMore" @click="showMore = true">+</button>
        <button class="show-more" v-if="showMore" @click="showMore = false">-</button>
      </div>
    </div>
    <div v-if="showMore" class="task-data">
      <span><b>Inicio:</b>  {{ props.task.initialDate }}</span>
      <span><b>Final:</b>  {{ props.task.finalDate }}</span>
      <span><b>Estado:</b>  {{ props.task.status }}</span>
      <span><b>Prioridad:</b>  {{ props.task.priority }}</span>
      <div class="task-description">
        <p>{{ props.task.description }}</p>
      </div>
      <div class="task-actions">
        <button @click="updateTask('in-progress')" v-if="props.task.status === 'pending'" class="task-btn submit-btn">Aceptar</button>
        <button @click="updateTask('completed')" v-if="props.task.status === 'in-progress'" class="task-btn submit-btn">Completar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* task */

.dashboard-task {
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

/* task main info */

.dashboard-task-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-task-ps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.task-priority {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 5px;
}

.low {
  background-image: radial-gradient(circle at center, #8FBC8F, #3CB371);
}

.medium {
  background-image: radial-gradient(circle at center, #FFFF00, #FFA500);
}

.high {
  background-image: radial-gradient(circle at center, #FF0000, #8B0000);
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

/* task data */

.task-data {
  padding: 10px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-top: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 0.5rem;
}

.task-description {
  width: 100%;
}

/* task actions */

.task-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.task-btn {
  width: 200px;
  padding: 7px;
  border: none;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
}
</style>
