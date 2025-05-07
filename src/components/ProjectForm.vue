<script setup>
import { onMounted, ref } from 'vue'
import { getAPIData } from '@/utils/utils';
import { useAuthStore } from '../stores/auth';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore();
const user = ref(null);

const id = ref('')
const name = ref('')
const client = ref('')
const initialDate = ref('')
const finalDate = ref('')
const status = ref('pending')
const priority = ref('low')
const description = ref('')
const assignedTo = ref([])

const usersAssigned = ref([]);
const usersNotAssigned = ref([]);

const showForm = ref(false)

const emit = defineEmits(['create-project', 'update-project', 'delete-project'])

onMounted( () => {
  user.value = authStore.user;
})

/**
 * Handles the submission of the project form.
 * Prevents the default form submission and emits either a 'create-project' or
 * 'update-project' event based on the presence of an id.
 *
 * @param {Event} e - The form submission event.
 */
function submitProject(e) {
  e.preventDefault()
  const project = {
    name: name.value,
    client: client.value,
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
      project
    }
    emit('update-project', data)
  } else {
    emit('create-project', project)
  }
}

/**
 * Emits a 'delete-project' event with the id of the project to delete.
 */
function deleteProject() {
  const data = {
    _id: id.value
  }
  emit('delete-project', data)
}

/**
 * Resets the form fields to empty values.
 * Useful for clearing the form when the user is no longer selected.
 */
function clearForm() {
  id.value = ''
  name.value = ''
  client.value = ''
  initialDate.value = ''
  finalDate.value = ''
  status.value = ''
  priority.value = ''
  description.value = ''
  assignedTo.value = []
}

/**
 * Toggles the visibility of the project form.
 * When the form is shown, it clears the form fields.
 * This is useful for switching between form view states.
 */
function showHideForm() {
  showForm.value = !showForm.value
  clearForm()
}

/**
 * Populates the form fields with the data from the selected project.
 * Sets the visibility of the form to true.
 *
 * @param {Object} project - The project object containing the details to populate the form.
 * @param {string} project._id - The unique identifier of the project.
 * @param {string} project.name - The name of the project.
 * @param {string} project.client - The client associated with the project.
 * @param {string} project.initialDate - The initial date of the project.
 * @param {string} project.finalDate - The final date of the project.
 * @param {string} project.status - The current status of the project.
 * @param {string} project.priority - The priority level of the project.
 * @param {string} project.description - The description of the project.
 */
function selectProject(project) {
  id.value = project._id
  name.value = project.name
  client.value = project.client
  initialDate.value = project.initialDate
  finalDate.value = project.finalDate
  status.value = project.status
  priority.value = project.priority
  description.value = project.description
  assignedTo.value = project.assignedTo

  checkAssigned()

  showForm.value = true
}

async function checkAssigned() {
  const allUsers = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/users`);
  allUsers.forEach(u => {
    if (assignedTo.value.includes(u._id)) {
      usersAssigned.value.push(u);
    } else {
      usersNotAssigned.value.push(u);
    }
  })
  if (assignedTo.value.length === 0) {
    usersAssigned.value.push(user);
    assignedTo.value.push(user.value._id);
    usersNotAssigned.value = usersNotAssigned.value.filter(u => u._id !== user.value._id);
  }
}

defineExpose({
  clearForm,
  showHideForm,
  selectProject
})
</script>

<template>
  <div class="btn-container">
    <button @click="showHideForm" :class="['btn-form', showForm ? 'btn-hide' : 'btn-show']"> {{ showForm ? 'Ocultar' : 'Crear' }} proyecto</button>
  </div>
  <form :class="{ 'form-hidden': !showForm }" class="form-main">
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
      <div class="form-list">
        <label for="assignedTo">Asignados:</label>
      </div>
      <div class="form-buttons">
          <button type="submit" class="submit-btn" @click="submitProject">Guardar</button>
          <button type="button" class="clear-btn" @click="clearForm">Limpiar</button>
          <button v-if="id" type="button" class="delete-btn" @click="deleteProject">Eliminar</button>
        </div>
    </fieldset>
  </form>
</template>

<style scoped>
  .form-hidden {
    display: none;
  }

  .btn-container {
    display: flex;
    justify-content: end;
    margin-bottom: 1rem;
  }

  .btn-form {
    width: 200px;
    border: none;
    border-radius: 15px;
    color: white;
    padding: 10px 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .btn-show {
    background-color: #4CAF50;
  }

  .btn-hide {
    background-color: #ff0000;
  }
</style>
