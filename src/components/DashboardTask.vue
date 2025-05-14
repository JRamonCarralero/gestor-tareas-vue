<script setup>
const props = defineProps(['task'])
</script>

<template>
  <div :class="['dashboard-project', props.task.status.toLowerCase()]">
    <p>{{ props.task.name }}</p>
  </div>
</template>

<style scoped>
.dashboard-project {
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.completed {
  background-color: rgb(192, 255, 192);
  color: #fff;
}

.cancelled {
  background-color: rgb(255, 192, 192);
  color: #fff;
}

.in-progress {
  background-color: rgb(192, 192, 255);
  color: #fff;
}

.pending {
  background-color: rgb(255, 255, 192);
  color: #fff;
}
</style>
