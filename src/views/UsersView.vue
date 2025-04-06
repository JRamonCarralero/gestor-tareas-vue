<script setup>
import UsersTable from '../components/UsersTable.vue'
import UserForm from '../components/UserForm.vue'
import { getAPIData } from '@/utils/utils'

const API_PORT = location.port ? `:3333` : ''

async function createUser(user) {
  console.log('create user', user)
  const newUser = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/user`, 'POST', JSON.stringify(user));
  console.log('new user', newUser)
}

function updateUser(data) {
  console.log('update user function', data)
}

</script>

<template>
  <h2>Usuarios</h2>
  <div id="users-table-container" class="users-table-container">
    <UsersTable />
  </div>
  <div id="user-form-container" class="user-form-container">
    <UserForm @create-user="(user) => createUser(user)" @update-user="(data) => updateUser(data)" />
  </div>
</template>
