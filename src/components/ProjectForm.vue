<script setup>
import { ref } from 'vue'
import { getAPIData } from '@/utils/utils';
import { useAuthStore } from '../stores/auth';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore();
const user = authStore.user;

const id = ref('')
const name = ref('')
const client = ref('')
const initialDate = ref('')
const finalDate = ref('')
const status = ref('pending')
const priority = ref('low')
const description = ref('')
const assignedTo = ref([])
const selectedAssigned = ref('')

const usersAssigned = ref([]);
const usersNotAssigned = ref([]);

const showForm = ref(false)

const emit = defineEmits(['create-project', 'update-project', 'delete-project'])

// onMounted( () => {
//   user.value = authStore.user;
// })

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
  selectedAssigned.value = ''

  checkAssigned()
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
 * @param {string[]} project.assignedTo - The IDs of the users assigned to the project.
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

/**
 * Checks which users are assigned to the project and which are not.
 * Populates the 'usersAssigned' and 'usersNotAssigned' arrays with the respective users.
 * If there are no assigned users, assigns the current user to the project.
 */
async function checkAssigned() {
  usersAssigned.value = [];
  usersNotAssigned.value = [];
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
    assignedTo.value.push(user._id);
    usersNotAssigned.value = usersNotAssigned.value.filter(u => u._id !== user._id);
  }
}

/**
 * Assigns a user to the project.
 * Adds the user to the assigned users list and removes them from the not assigned users list.
 */
function assignUser() {
  assignedTo.value.push(selectedAssigned.value);
  usersAssigned.value.push(usersNotAssigned.value.find(u => u._id === selectedAssigned.value));
  usersNotAssigned.value = usersNotAssigned.value.filter(u => u._id !== selectedAssigned.value);

  console.log('selectedAssigned', selectedAssigned.value);
  console.log('user', user._id);
}

/**
 * Removes a user from the assigned users list and adds them to the not assigned users list.
 * @param {string} userId - The ID of the user to remove.
 */
function removeAssigned(userId) {
  assignedTo.value = assignedTo.value.filter(u => u !== userId);
  usersNotAssigned.value.push(usersAssigned.value.find(u => u._id === userId));
  usersAssigned.value = usersAssigned.value.filter(u => u._id !== userId);
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
      <div class="form-assigned-list">
        <div class="assigned-header">
          <h3>Asignados</h3>
          <div class="assigned-select">
            <label for="assignedTo">Seleccione usuario:</label>
            <select id="assignedTo" name="assignedTo" v-model="selectedAssigned">
              <option v-for="una in usersNotAssigned" :key="una._id" :value="una._id">{{ una.name }}</option>
            </select>
            <button type="button" id="btn-assign" class="submit-btn assign-btn" @click="assignUser">Asignar</button>
          </div>
        </div>
        <ul class="assigned-list">
          <li class="assigned-item" v-for="ua in usersAssigned" :key="ua._id" :value="ua._id">
            {{ ua.name }}
            <button v-if="user && ua._id !== user._id" type="button" class="table-btn" @click="removeAssigned(ua._id)">🗑</button>
          </li>
        </ul>
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

  .form-assigned-list {
    width: 100%;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
  }

  .assigned-header {
    display: flex;
    justify-content: space-between;
  }

  .assigned-select {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    gap: 10px;
  }

  .assign-btn {
    width: 100px;
    border: none;
    border-radius: 15px;
    color: white;
    padding: 2px 8px;
    text-align: center;
    text-decoration: none;
    font-weight: 500;
    display: inline-block;
    margin: 4px 2px;
    cursor: pointer;
  }

  .assigned-list {
    width: 100%;
    display: flex;
    gap: 50px;
    flex-wrap: wrap;
    list-style: none;
  }

  .table-btn {
    background: #f2f2f2;
    border: 1px solid black;
    border-radius: 5px;
    width: 30px;
    margin-left: 15px;
    cursor: pointer;
  }
</style>
