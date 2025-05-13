<script setup>
import ProjectForm from '@/components/ProjectForm.vue';
import ProjectList from '@/components/ProjectList.vue';
import { getAPIData } from '@/utils/utils';
import { useTemplateRef, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const API_PORT = location.port ? `:3333` : ''

const authStore = useAuthStore();
const user = ref(null);

const projectForm = useTemplateRef('projectForm')

const projects = ref([])

onMounted(async () => {
  projects.value = await getProjects()
  user.value = authStore.user;
})

/**
 * Gets all projects from the server.
 * @returns {Promise<Object[]>} an array of project objects
 */
async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects`);
  return response
}

/**
 * Creates a new project in the server adding the current user as the creator.
 * If the initial date is greater than or equal to the final date, shows an alert.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the projects list.
 * @param {Object} project - The project data to create
 * @returns {Promise<void>}
 */
async function createProject(project) {
  project.createdBy = user.value._id
  if (project.initialDate >= project.finalDate) {
    alert('La fecha inicial debe ser menor a la fecha final')
    return
  }
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/projects`, 'POST', JSON.stringify(project));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.showHideForm()
  projects.value = await getProjects()
}

/**
 * Updates a project in the server.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the projects list.
 * @param {Object} data - an object containing the project id and the project data to update
 * @returns {Promise<void>}
 */
async function updateProject(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/projects/${data._id}`, 'PUT', JSON.stringify(data.project));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.showHideForm()
  projects.value = await getProjects()
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
  projectForm.value.selectProject(project)
}

/**
 * Deletes a project from the server.
 * If the response is not OK, shows an alert with the response message.
 * If the response is OK, clears the form and updates the projects list.
 * @param {Object} data - an object containing the project id to delete
 * @returns {Promise<void>}
 */
async function deleteProject(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/projects/${data._id}`, 'DELETE');
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.showHideForm()
  projects.value = await getProjects()
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Proyectos</h2>
  </div>
  <div class="view-container">
    <div id="project-form-container" class="view-form-container">
      <ProjectForm ref="projectForm" @create-project="createProject" @update-project="updateProject" @delete-project="deleteProject" />
    </div>
    <div id="projects-list-container" class="view-table-container">
      <ProjectList :projects="projects" @select-project="(project) => selectProject(project)" />
    </div>
  </div>
</template>
