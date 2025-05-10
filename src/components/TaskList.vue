<script setup>
  const props = defineProps(['tasks'])
</script>

<template>
  <ul class="comp-list">
      <li class="comp-element" v-for="task in props.tasks" :key="task._id">
        <div class="comp-info">
          <h3 class="comp-name" @click="$emit('select-task', task)">{{ task.name }}</h3>
          <div class="comp-data">
            <span>Asignado a: {{ task.assignedTo }}</span>
            <span>Fecha de Inicio: {{ task.initialDate }}</span>
            <span>Fecha Final: {{ task.finalDate }}</span>
            <span>Estado: {{ task.status }}</span>
            <span>Prioridad: {{ task.priority }}</span>
          </div>
          <div class="comp-description">
            <p>{{ task.description }}</p>
          </div>
        </div>
      </li>
    </ul>
</template>
