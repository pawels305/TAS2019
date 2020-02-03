<template>
  <div>
    <header>
      <div id="logo">
        Tworzenie Bloga
      </div>
      <p>Aby rozpocząć wypełnij poniższe pola</p>
    </header>
    <div id="login_site">
      <div class="login">
        <form
          method="post"
          @submit.prevent="createBlog"
          @keyup.native.enter="createBlog"
        >
          <h2>Nowy Blog</h2>
          <input
            id="blogName"
            v-model="blogName"
            type="text"
            name="blogName"
            placeholder="Nazwa Bloga"
            require
          >
          <input
            id="blogName"
            v-model="tag"
            type="text"
            tag="tag"
            placeholder="tag"
            require
          >
          <p class="message message--error">
            {{ error }}
          </p>
          <button type="submit">
            Dodaj Blog
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
      blogName: ''
    }
  },
  methods: {
    async createBlog () {
      const response = await api.createBlog({
        name: this.blogName,
        tag: this.tag
      })

      if (response.status === 200) {
        this.$router.push({ name: 'blog', params: { blogId: response.data._id } })
      } else this.error = response.data.error
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
