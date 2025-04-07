<script setup>
  import { ref, watch } from 'vue'

  const id = ref('')
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const role = ref('')

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
      id.value = ''
      name.value = ''
      email.value = ''
      password.value = ''
      role.value = ''
    }
  })

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

</script>

<template>
  <form class="user-form">
    <input type="hidden" name="id" id="id" v-model="id" />
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" v-model="name" required />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" v-model="email" required />
    </div>
    <div v-if="!id" class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" v-model="password" required />
    </div>
    <div class="form-group">
      <label for="role">Role</label>
      <select id="role" name="role" v-model="role" required>
        <option value="admin">Gestor</option>
        <option value="user">Técnico</option>
      </select>
    </div>
    <button type="submit" @click="submitUser">Submit</button>
    <button type="button" @click="$emit('clear-user')">Clear</button>
  </form>
</template>
