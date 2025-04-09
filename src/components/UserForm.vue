<script setup>
  import { ref, watch } from 'vue'

  const id = ref('')
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const role = ref('user')

  const emit = defineEmits(['create-user', 'update-user', 'clear-user'])

  const props = defineProps(['selectedUser'])

  watch(props, () => {
    if (props.selectedUser) {
      id.value = props.selectedUser._id
      name.value = props.selectedUser.name
      email.value = props.selectedUser.email
      password.value = props.selectedUser.password
      role.value = props.selectedUser.role
    } else {
      clearForm()
    }
  })

  /**
   * Resets the form fields to empty values.
   * Useful for clearing the form when the user is no longer selected.
   */
  function clearForm() {
    id.value = ''
    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'user'
  }

/**
 * Handles the form submission event for creating or updating a user.
 * Prevents the default form submission behavior and validates if all
 * required fields are filled. If the form is valid, emits either a
 * 'create-user' or 'update-user' event depending on whether the user
 * has an ID.
 *
 * @param {Event} e - The form submission event
 */
  function submitUser(e) {
    e.preventDefault()
    if (!name.value || !email.value || !password.value || !role.value) {
      alert('Por favor, rellene todos los campos')
      return
    }
    const user = {
      name: name.value,
      email: email.value,
      role: role.value
    }
    if (id.value) {
      emit('update-user', { user, _id: id.value } )
    } else {
      user.password = password.value
      emit('create-user', user)
    }
  }

  defineExpose({
    clearForm
  })

</script>

<template>
  <form class="user-form">
    <input type="hidden" name="id" id="id" v-model="id" />
    <fieldset class="user-form-fieldset">
      <legend>Datos del usuario</legend>
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="email" required />
      </div>
      <div v-if="!id" class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="role">Role:</label>
        <select id="role" name="role" v-model="role" required>
          <option value="admin">Gestor</option>
          <option value="user">Técnico</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" @click="submitUser">Submit</button>
        <button type="button" @click="$emit('clear-user')">Clear</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.user-form {
  width: 100%;
  padding: 20px;
}

.user-form-fieldset {
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 300px;
}

.form-buttons {
  width: 80%;
  display: flex;
  justify-content: space-between;
  gap: 10px;

  button {
    width: 200px;
    padding: 5px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
