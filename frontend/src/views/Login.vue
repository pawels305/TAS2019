<template>
  <div id="login_site">
    <div id="logo">
      Nazwa Bloga
    </div>
    <div class="login">
      <form
        method="post"
        @submit.prevent="handleLogin"
      >
        <h1>LOGOWANIE</h1>
        <input
          v-model="user.username"
          type="text"
          placeholder="Nazwa użytkownika"
          required
        >
        <input
          v-model="user.password"
          type="password"
          placeholder="Hasło"
          required
        >
        <p
          v-if="error"
          class="message message--error"
        >
          {{ error }}
        </p>
        <button type="submit">
          Zaloguj się
        </button>
      </form>
      <div class="register">
        <router-link :to="{ name: 'resetPasswordEmail' }">
          Zapomniałem hasło
        </router-link>
      </div>
      <div class="strike">
        <span>Nie masz konta?</span>
      </div>
      <div class="register">
        <router-link to="/register">
          Zarejestruj się
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

import api from '../api'

export default {
  data () {
    return {
      error: null,
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const response = await api.login(this.user)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      this.$store.dispatch('login', response.data)
      this.$router.push({ name: 'events' })
    }
  }
}
</script>
