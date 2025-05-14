<script setup>
const props = defineProps(['task'])
</script>

<template>
  <div class="dashboard-project">
    <p>{{ props.task.name }}</p>
  </div>
</template>
