<script setup>
  import { defineProps } from 'vue'
  const props = defineProps(['users'])

</script>

<template>
  <table id="users-table" class="users-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th class="th-100"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in props.users" :key="user._id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role }}</td>
        <th class="table-btn-th th-100">
          <button class="table-btn" @click="$emit('edit-user', user)">✎</button>
          <button class="table-btn" @click="$emit('remove-user', { _id: user._id, name: user.name })">🗑</button>
        </th>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  .users-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .users-table th,
  .users-table td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  .users-table th {
    background-color: #f2f2f2;
  }
  .users-table tr:hover {
    background-color: #f5f5f5;
  }
  .th-100 {
    width: 100px;
  }
  .table-btn-th {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .table-btn {
    background: none;
    border: 1px solid black;
    border-radius: 5px;
    width: 30px;
    cursor: pointer;
  }
</style>
