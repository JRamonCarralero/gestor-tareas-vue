<script setup>
import UsersTable from '../components/UsersTable.vue'
import UserForm from '../components/UserForm.vue'
import { getAPIData } from '@/utils/utils'
import { onMounted, ref, useTemplateRef } from 'vue'

const API_PORT = location.port ? `:3333` : ''

const users = ref([])
const selectedUser = ref(null)

const uForm = useTemplateRef('usersForm')

onMounted(async () => {
  users.value = await getUsers()
})

/**
 * Fetches the list of users from the database.
 * @async
 * @function
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
async function getUsers() {
  const users = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/users`);
  return users
}

/**
 * Creates a new user in the database with the given user data.
 * When the user is created, the users list is updated and the selected user is cleared.
 * @async
 * @function
 * @param {Object} user - The user data to create.
 * @returns {Promise<void>}
 */
async function createUser(user) {
  const newUser = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, 'POST', JSON.stringify(user));
  users.value.push(newUser)
  clearUser()
}

/**
 * Updates an existing user in the database with the given data.
 * After the update, the selected user is cleared and the list of users is refreshed.
 *
 * @async
 * @function
 * @param {Object} data - The data containing the user id and updated user information.
 * @param {string} data._id - The id of the user to update.
 * @param {Object} data.user - The updated user data.
 * @returns {Promise<void>}
 */
async function updateUser(data) {
  await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/users/${data._id}`, 'PUT', JSON.stringify(data.user));
  clearUser()
  users.value = await getUsers()
}

/**
 * Sets the selectedUser to the specified user object.
 *
 * @param {Object} user - The user object to be set as the selected user.
 */
function editUser(user) {
  selectedUser.value = user
}

/**
 * Removes a user from the database with the given user id.
 * The user is asked for confirmation before the deletion.
 * When the user is deleted, the selected user is cleared and the list of users is refreshed.
 * @async
 * @function
 * @param {Object} data - The data containing the user id and user name.
 * @param {string} data._id - The id of the user to delete.
 * @param {string} data.name - The name of the user to delete.
 * @returns {Promise<void>}
 */
async function removeUser(data) {
  if (window.confirm(`¿Desea borrar el usuario ${data.name}?`)) {
    await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/users/${data._id}`, 'DELETE');
    clearUser()
    users.value = await getUsers()
  }
}

/**
 * Resets the selectedUser to null and clears the user form if no user is selected.
 * If a user is selected, it sets the selectedUser to null.
 * @function
 */
function clearUser() {
  if (!selectedUser.value) uForm.value.clearForm()
  else selectedUser.value = null
}

</script>

<template>
  <h2>Usuarios</h2>
  <div id="users-table-container" class="users-table-container">
    <UsersTable :users="users" @edit-user="(user) => editUser(user)" @remove-user="(id) => removeUser(id)" />
  </div>
  <div id="user-form-container" class="user-form-container">
    <UserForm ref="usersForm" :selected-user="selectedUser" @create-user="(user) => createUser(user)" @update-user="(data) => updateUser(data)" @clear-user="clearUser" />
  </div>
</template>
