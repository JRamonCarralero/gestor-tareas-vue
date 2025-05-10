<script setup>
import { ref, emit } from 'vue'

const id = ref('')
const name = ref('')
const initialDate = ref('')
const finalDate = ref('')
const status = ref('pending')
const priority = ref('low')
const description = ref('')
const assignedTo = ref('')
const usersInProject = ref([])

const showForm = ref(false)

function showHideForm() {
  showForm.value = !showForm.value
  clearForm()
}

function submitTask(e) {
  e.preventDefault()
  const task = {
    name: name.value,
    initialDate: initialDate.value,
    finalDate: finalDate.value,
    status: status.value,
    priority: priority.value,
    description: description.value,
    assignedTo: assignedTo.value
  }
  if (id.value) {
    const data = {
      _id: id.value,
      task
    }
    emit('update-task', data)
  } else {
    emit('create-task', task)
  }
}

function deleteTask() {
  const data = {
    _id: id.value
  }
  emit('delete-task', data)
}

function selectTask(task) {
  id.value = task._id
  name.value = task.name
  initialDate.value = task.initialDate
  finalDate.value = task.finalDate
  status.value = task.status
  priority.value = task.priority
  description.value = task.description
  assignedTo.value = task.assignedTo

  showForm.value = true
}

function clearForm() {
  id.value = ''
  name.value = ''
  initialDate.value = ''
  finalDate.value = ''
  status.value = ''
  priority.value = ''
  description.value = ''
  assignedTo.value = ''
}

defineExpose({
  showHideForm,
  selectTask
})
</script>

<template>
  <div class="btn-container">
    <button @click="showHideForm" :class="['btn-form', showForm ? 'btn-hide' : 'btn-show']"> {{ showForm ? 'Ocultar' : 'Crear' }} tarea</button>
  </div>
  <form :class="{ 'form-hidden': !showForm }" class="form-main">
    <input type="hidden" name="id" id="id" v-model="id" />
    <fieldset class="form-fieldset">
      <legend>Datos de la tarea</legend>
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="assignedTo">Asignado a:</label>
        <select id="assignedTo" name="assignedTo" v-model="assignedTo" required>
          <option v-for="uip in usersInProject" :key="uip._id" :value="uip._id">{{ uip.name }}</option>
        </select>
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
        <button type="submit" class="submit-btn" @click="submitTask">Guardar</button>
        <button type="button" class="clear-btn" @click="clearForm">Limpiar</button>
        <button v-if="id" type="button" class="delete-btn" @click="deleteTask">Eliminar</button>
      </div>
    </fieldset>
  </form>
</template>
