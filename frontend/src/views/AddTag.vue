<template>
  <div>
    <header>
      <div id="logo">
        Dodawanie tagu
      </div>
    </header>
    <div id="login_site">
      <div class="login">
        <form
          method="post"
          @submit.prevent="updateUser"
          @keyup.native.enter="updateUser"
        >
          <h1><b>Wprowadź tag, który cię interesuje</b></h1>
          <input
            id="tag"
            v-model="tag"
            type="text"
            name="tag"
            placeholder="tag"
            require
          >
          <p class="message message--error">
            {{ error }}
          </p>
          <button type="submit">
            Dodaj tag
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
      error: null,
      tag: ''
    }
  },
  methods: {
    async updateUser () {
      const response = await api.updateUser({ tag: this.tag })
      if (response.status === 200) {
        //
      } else {
        // blad
      }
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
