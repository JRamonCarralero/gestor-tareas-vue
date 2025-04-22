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
  <div class="login-container">
    <label for="email" class="l-label">Email:</label>
    <input type="email" id="email" name="email" class="l-input" v-model="email" placeholder="Email">
    <label for="password" class="l-label">Contraseña:</label>
    <input type="password" id="password" name="password" class="l-input" v-model="password" placeholder="Contraseña">
    <button @click="login" class="l-btn">Login</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.login-container {
  width: 500px;
  margin: 250px auto 0;
  padding: 50px 20px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.l-label {
  font-weight: bold;
}

.l-input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.l-btn {
  width: 250px;
  padding: 10px;
  margin-top: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.3em;
}

</style>
