<script setup>
  import { defineProps } from 'vue'

  const props = defineProps(['projects'])
</script>

<template>
  <ul class="projects-list">
    <li class="project-element" v-for="project in props.projects" :key="project._id">
      <div class="project-info">
        <h3 class="project-name">{{ project.name }}</h3>
        <div class="project-data">
          <span>Client: {{ project.client }}</span>
          <span>Initial Date: {{ project.initialDate }}</span>
          <span>Final Date: {{ project.finalDate }}</span>
          <span>Status: {{ project.status }}</span>
          <span>Priority: {{ project.priority }}</span>
        </div>
        <div class="project-description">
          <p>{{ project.description }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>
