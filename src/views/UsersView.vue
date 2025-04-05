<script setup>
import UsersTable from '../components/UsersTable.vue'
import UserForm from '../components/UserForm.vue'
</script>

<template>
  <h2>Usuarios</h2>
  <div id="users-table-container" class="users-table-container">
    <UsersTable />
  </div>
  <div id="user-form-container" class="user-form-container">
    <UserForm />
  </div>
</template>
