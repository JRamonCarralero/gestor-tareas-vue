<script setup>
import UsersTable from '../components/UsersTable.vue'
import UserForm from '../components/UserForm.vue'
import { getAPIData } from '@/utils/utils'
import { onMounted, ref, watch } from 'vue'

const API_PORT = location.port ? `:3333` : ''

const users = ref([])
const selectedUser = ref(null)

onMounted(async () => {
  users.value = await getUsers()
})

watch(users, () => {
  console.log('users', users.value)
})

async function getUsers() {
  const users = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/users`);
  console.log('users', users)
  return users
}

async function createUser(user) {
  console.log('create user', user)
  const newUser = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, 'POST', JSON.stringify(user));
  console.log('new user', newUser)
  users.value.push(newUser)
  selectedUser.value = null
}

async function updateUser(data) {
  console.log('update user function', data)
  const updatedUser = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/users/${data._id}`, 'PUT', JSON.stringify(data.user));
  console.log('updated user', updatedUser)
  selectedUser.value = null
  users.value = await getUsers()
}

function editUser(user) {
  selectedUser.value = user
  console.log('edit user function', user)
}

async function removeUser(id) {
  console.log('remove user function', id)
  if (window.confirm(`¿Desea borrar el usuario ${id}?`)) {
    const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/users/${id}`, 'DELETE');
    selectedUser.value = null
    console.log('response', response)
    users.value = await getUsers()
  }
}

function clearUser() {
  selectedUser.value = null
}

</script>

<template>
  <h2>Usuarios</h2>
  <div id="users-table-container" class="users-table-container">
    <UsersTable :users="users" @edit-user="(user) => editUser(user)" @remove-user="(id) => removeUser(id)" />
  </div>
  <div id="user-form-container" class="user-form-container">
    <UserForm :selected-user="selectedUser" @create-user="(user) => createUser(user)" @update-user="(data) => updateUser(data)" @clear-user="clearUser" />
  </div>
</template>
