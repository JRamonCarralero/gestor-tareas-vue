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

<style scoped>
  .projects-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .project-element {
    border-bottom: 1px solid #ccc;
    padding: 10px;
  }

  .project-info {
    display: flex;
    flex-direction: column;
  }

  .project-name {
    font-weight: bold;
    margin-bottom: 5px;
    text-align: center;
  }

  .project-data {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-bottom: 5px;
  }
  </style>
