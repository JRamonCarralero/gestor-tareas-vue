<script setup>
  import { defineProps, watch } from 'vue'
  const props = defineProps(['users'])

  watch(props, () => {
    console.log('users en hijo', props.users)
  })
</script>

<template>
  <table id="users-table" class="users-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in props.users" :key="user._id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role }}</td>
        <th>
          <button class="table-btn" @click="$emit('edit-user', user)">✎</button>
          <button class="table-btn" @click="$emit('remove-user', user._id)">🗑</button>
        </th>
      </tr>
    </tbody>
  </table>
</template>
