<script setup>
  const props = defineProps(['tasks'])
</script>

<template>
  <ul class="comp-list">
      <li class="comp-element" v-for="task in props.tasks" :key="task._id">
        <div class="comp-info">
          <h3 class="comp-name" @click="$emit('select-task', task)">{{ task.name }}</h3>
          <div class="comp-data">
            <span><b>Asignado a:</b> {{ task.userName }}</span>
            <span><b>Fecha de Inicio:</b> {{ task.initialDate }}</span>
            <span><b>Fecha Final:</b> {{ task.finalDate }}</span>
            <span><b>Estado:</b> {{ task.status }}</span>
            <span><b>Prioridad:</b> {{ task.priority }}</span>
          </div>
          <div class="comp-description">
            <p>{{ task.description }}</p>
          </div>
        </div>
      </li>
    </ul>
</template>
