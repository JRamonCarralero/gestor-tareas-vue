<script setup>
import { ref } from 'vue'

const id = ref('')
const name = ref('')
const client = ref('')
const initialDate = ref('')
const finalDate = ref('')
const status = ref('pending')
const priority = ref('low')
const description = ref('')

const emit = defineEmits(['create-project', 'update-project'])

function submitProject(e) {
  e.preventDefault()
  const project = {
    name: name.value,
    client: client.value,
    initialDate: initialDate.value,
    finalDate: finalDate.value,
    status: status.value,
    priority: priority.value,
    description: description.value
  }
  if (id.value) {
    const data = {
      _id: id.value,
      project
    }
    console.log('update', data)
    emit('update-project', data)
  } else {
    console.log('create', project)
    emit('create-project', project)
  }
}

function clearForm() {
  id.value = ''
  name.value = ''
  client.value = ''
  initialDate.value = ''
  finalDate.value = ''
  status.value = ''
  priority.value = ''
  description.value = ''
}

defineExpose({
  clearForm
})
</script>

<template>
  <form class="form-main">
    <input type="hidden" name="id" id="id" v-model="id" />
    <fieldset class="form-fieldset">
      <legend>Datos del proyecto</legend>
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="client">Cliente:</label>
        <input type="text" id="client" name="client" v-model="client" required />
      </div>
      <div class="form-group">
        <label for="initialDate">Fecha de inicio:</label>
        <input type="date" id="initialDate" name="initialDate" v-model="initialDate" />
      </div>
      <div class="form-group">
        <label for="finalDate">Fecha de finalización:</label>
        <input type="date" id="finalDate" name="finalDate" v-model="finalDate" />
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" name="status" v-model="status" required>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En progreso</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
      <div class="form-group">
        <label for="priority">Prioridad:</label>
        <select id="priority" name="priority" v-model="priority" required>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>
      <div class="form-textarea">
        <label for="description">Descripción:</label>
        <textarea id="description" name="description" v-model="description" rows="7"></textarea>
      </div>
      <div class="form-buttons">
          <button type="submit" class="submit-btn" @click="submitProject">Submit</button>
          <button type="button" class="clear-btn" @click="clearForm">Clear</button>
        </div>
    </fieldset>
  </form>
</template>
