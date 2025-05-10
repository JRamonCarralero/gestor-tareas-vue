<script setup>
  const props = defineProps(['projects'])
</script>

<template>
  <ul class="comp-list">
    <li class="comp-element" v-for="project in props.projects" :key="project._id">
      <div class="comp-info">
        <h3 class="comp-name" @click="$emit('select-project', project)">{{ project.name }}</h3>
        <div class="comp-data">
          <span>Cliente: {{ project.client }}</span>
          <span>Fecha de Inicio: {{ project.initialDate }}</span>
          <span>Fecha Final: {{ project.finalDate }}</span>
          <span>Estado: {{ project.status }}</span>
          <span>Prioridad: {{ project.priority }}</span>
        </div>
        <div class="comp-description">
          <p>{{ project.description }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>
