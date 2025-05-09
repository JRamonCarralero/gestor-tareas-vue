<script setup>
  const props = defineProps(['tasks'])
</script>

<template>
  <ul>
    <li v-for="task in props.tasks" :key="task._id">
      {{ task.name }}
    </li>
  </ul>
</template>
