<template>
  <div>
    <header>
      <div id="logo">
        Nazwa Bloga
      </div>
      <hr>
      <h2><span>Zapominiałeś hasło?</span> Nic strasznego!</h2>
      <p>
        Postępuj zgodnie z poniższymi wskazówkami, a pomożemy Ci odzyskać konto.
      </p>
    </header>
    <div id="login_site">
      <div class="login">
        <form
          method="post"
          @submit.prevent="resetPassword"
        >
          <h2>PRZYPOMNIJ HASŁO</h2>
          <input
            v-model="password"
            type="password"
            placeholder="Nowe hasło"
            required
          >
          <p
            v-if="message.text"
            :class="message.style"
          >
            {{ message.text }}
          </p>
          <button type="submit">
            Zmień hasło
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import api from '../api'

export default {
  data () {
    return {
      message: {
        style: null,
        text: null
      },
      resetData: {
        token: this.$route.params.token,
        password: ''
      }
    }
  },
  methods: {
    displayMessage (type, message) {
      this.message.style = `message message--${type}`
      this.message.text = message
    },
    async resetPassword () {
      const response = await api.resetPassword(this.resetData)

      if (response.status !== 200) {
        return void this.displayMessage('error', response.data.message)
      }

      this.displayMessage('success', 'Hasło zostało zmienione pomyślnie. Można się zalogować')
      this.password = ''
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  text-align: center;
  font-family: "Kalam", sans-serif;

  #logo {
    padding-top: 5px;
    font-size: 64px;
    color: var(--color-dark-red);
    margin-bottom: -15px;

    @media (max-width: 410px) {
      font-size: 53px;
    }
  }

  hr {
    margin-top: 15px;
    margin-bottom: 15px;
    background: #adac97;
  }

  h2 {
    color: var(--color-dark);
    font-size: 26px;
    margin-top: 0;
    padding: 0;

    span {
      font-size: 26px;
      color: var(--color-dark-red);
    }
  }

  p {
    margin-top: -15px;
    padding-top: 0;
    color: var(--color-dark);
    font-size: 20px;
  }
}
</style>
