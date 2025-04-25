<script setup>
  import { defineProps } from 'vue'

  const props = defineProps(['projects'])
</script>

<template>
  <ul>
    <li v-for="project in props.projects" :key="project._id">
      {{ project.name }}
    </li>
  </ul>
</template>
