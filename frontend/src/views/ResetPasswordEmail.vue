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
          @submit.prevent="sendPasswordResetEmail"
        >
          <h2>PRZYPOMNIJ HASŁO</h2>
          <input
            v-model="email"
            type="email"
            placeholder="Adres email"
            required
          >
          <p
            v-if="message.text"
            :class="message.style"
          >
            {{ message.text }}
          </p>
          <button type="sumbit">
            Zresetuj hasło
          </button>
        </form>
        <div class="strike">
          <span>Pamiętasz hasło?</span>
        </div>
        <div class="register">
          <router-link to="/login">
            Zaloguj się
          </router-link>
        </div>
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
      email: ''
    }
  },
  methods: {
    displayMessage (type, message) {
      this.message.style = `message message--${type}`
      this.message.text = message
    },
    async sendPasswordResetEmail () {
      const response = await api.sendPasswordResetEmail(this.email)

      if (response.status !== 200) {
        return void this.displayMessage('error', response.data.message)
      }

      this.displayMessage(
        'success',
        `Postępuj zgodnie ze wskazówkami przesłanymi na ${this.email}. Nie dostałeś maila? Sprawdź folder spam.`
      )

      this.email = ''
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
