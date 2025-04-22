<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js'; // Asegúrate de tener tu store de Pinia configurado
import { auth, signInWithEmailAndPassword } from '../../hidden/firebaseConfig.js'; // Tu configuración de Firebase Client SDK

const API_PORT = location.port ? `:3333` : ''

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  error.value = '';
  try {
    // Iniciar sesión en Firebase con email y contraseña y obtenemos los credenciales
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Enviar el ID token al backend para verificación
    const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/auth/verify-token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      authStore.setUser(userData); // Guarda la información del usuario en Pinia
      sessionStorage.setItem('isAuthenticated', 'true'); // Guarda un indicador de sesión
      router.push('/projects'); // Redirige a la página principal
    } else if (response.status === 401) {
      error.value = 'Credenciales inválidas.';
    } else {
      error.value = 'Error al iniciar sesión.';
      console.error('Error del backend:', await response.text());
    }

  } catch (err) {
    console.error('Error al iniciar sesión en Firebase:', err);
    error.value = 'Credenciales incorrectas.';
  }
};
</script>

<script>
export default {
  name: 'LoginForm',
};
</script>

<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <input type="email" v-model="email" placeholder="Email">
    <input type="password" v-model="password" placeholder="Contraseña">
    <button @click="login">Iniciar Sesión</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>
