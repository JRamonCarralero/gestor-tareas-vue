<script setup>
  const props = defineProps(['projects'])
</script>

<template>
  <ul class="comp-list">
    <li class="comp-element" v-for="project in props.projects" :key="project._id">
      <div class="comp-info">
        <h3 class="comp-name" @click="$emit('select-project', project)">{{ project.name }}</h3>
        <div class="comp-data">
          <span><b>Cliente:</b> {{ project.client }}</span>
          <span><b>Fecha de Inicio:</b> {{ project.initialDate }}</span>
          <span><b>Fecha Final:</b> {{ project.finalDate }}</span>
          <span><b>Estado:</b> {{ project.status }}</span>
          <span><b>Prioridad:</b> {{ project.priority }}</span>
        </div>
        <div class="comp-description">
          <p>{{ project.description }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>
