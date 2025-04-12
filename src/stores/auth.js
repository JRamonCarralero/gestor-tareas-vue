// /src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    clearUser() {
      this.user = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    loggedInUser: (state) => state.user,
    // ... otros getters si necesitas
  },
});
