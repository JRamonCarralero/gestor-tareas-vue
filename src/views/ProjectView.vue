<script setup>
import ProjectForm from '@/components/ProjectForm.vue';
import ProjectList from '@/components/ProjectList.vue';
import { getAPIData } from '@/utils/utils';
import { useTemplateRef, ref, onMounted } from 'vue';

const API_PORT = location.port ? `:3333` : ''

const projectForm = useTemplateRef('projectForm')

const projects = ref([])

onMounted(async () => {
  projects.value = await getProjects()
})

async function getProjects() {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/read/projects`);
  return response
}

async function createProject(project) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/projects`, 'POST', JSON.stringify(project));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.clearForm()
  projects.value = await getProjects()
}

async function updateProject(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/projects/${data._id}`, 'PUT', JSON.stringify(data.project));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.clearForm()
  projects.value = await getProjects()
}

function selectProject(project) {
  projectForm.value.selectProject(project)
}

async function deleteProject(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/delete/projects/${data._id}`, 'DELETE');
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.clearForm()
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
