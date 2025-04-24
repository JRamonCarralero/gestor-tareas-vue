<script setup>
import ProjectForm from '@/components/ProjectForm.vue';
import { getAPIData } from '@/utils/utils';
import { useTemplateRef } from 'vue';

const API_PORT = location.port ? `:3333` : ''

const projectForm = useTemplateRef('projectForm')

async function createProject(project) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/create/projects`, 'POST', JSON.stringify(project));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.clearProject()
}

async function updateProject(data) {
  const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/update/projects/${data._id}`, 'PUT', JSON.stringify(data.project));
  if (response.message !== 'OK') {
    alert(response.message)
    return
  }
  projectForm.value.clearProject()
}
</script>

<template>
  <div class="view-title-container">
    <h2 class="view-title">Proyectos</h2>
  </div>
  <div class="view-container">
    <div id="project-form-container" class="view-form-container">
      <ProjectForm ref="projectForm" @create-project="createProject" @update-project="updateProject" />
    </div>
  </div>
</template>
