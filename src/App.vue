<script setup>
import { ref, watch } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth';
import { auth, signOut } from '../hidden/firebaseConfig.js';

const authStore = useAuthStore();
const user = ref(null);
const router = useRouter();

/**
 * Logs the user out of Firebase Auth and Pinia auth store.
 * Also removes the isAuthenticated flag from session storage.
 */
async function logout() {
  authStore.clearUser();
  sessionStorage.removeItem('isAuthenticated');
  await signOut(auth);
  router.push('/');
}

watch(() => authStore.user, () => {
  user.value = authStore.user
})

</script>

<template>
  <header class="main-header">
    <h1>Gestor de Proyectos</h1>
        <nav class="navbar">
            <ul>
                <li v-if="!user"><RouterLink to="/">Login</RouterLink></li>
                <li v-if="user"><RouterLink to="/dashboard">Dashboard</RouterLink></li>
                <li v-if="user &&user.role === 'admin'"><RouterLink to="/users">Usuarios</RouterLink></li>
                <li v-if="user &&user.role === 'admin'"><RouterLink to="/tasks">Tareas</RouterLink></li>
                <li v-if="user &&user.role === 'admin'"><RouterLink to="/projects">Proyectos</RouterLink></li>
                <li v-if="user"><button id="logout-btn" class="logout-btn" @click="logout">Logout</button></li>
            </ul>
        </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>

.main-header {
    width: 100%;
    height: 125px;
    background: #000777;
    border-bottom: 2px solid #000444;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    z-index: 30;

    h1 {
        text-align: center;
        font-size: 36px;
        color: white;
        margin-bottom: 20px;
    }
}

.navbar {
    width: 100%;

    ul {
        list-style-type: none;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        text-align: center;
        align-items: center;

        li {
            flex-grow: 1;

            a {
                display: block;
                color: white;
                text-decoration: none;
                text-shadow: 2px 1px black;
                line-height: 2.5em;
                font-size: 1.3em;

                &:hover {
                    cursor: pointer;
                    background-color: #0011ff;
                }
            }

            .logout-btn {
                width: 100%;
                background: none;
                border: none;
                color: white;
                text-shadow: 2px 1px black;
                line-height: 2.5em;
                font-size: 1.3em;

                &:hover {
                    cursor: pointer;
                    background-color: #0011ff;
                }
            }
        }
    }
}

main {
  width: 100%;
  margin-top: 130px;
}
</style>
