<script setup>
  const tempUsers = [
    {_id: 1, name: 'Pepe', email: 'pepe@pe.pe', role: 'admin'},
    {_id: 2, name: 'Paco', email: 'paco@pa.pa', role: 'user'},
    {_id: 3, name: 'Luis', email: 'luis@lu.lu', role: 'user'},
  ]
</script>

<template>
  <table id="users-table" class="users-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in tempUsers" :key="user._id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role }}</td>
      </tr>
    </tbody>
  </table>
</template>
