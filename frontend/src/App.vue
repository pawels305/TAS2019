<template>
  <div>
    <div class="nav">
      <div
        class="show-xs nav-hamburger"
        @click="mobileMenu = !mobileMenu"
      >
        <i class="fa fa-bars" />
      </div>
      <router-link
        to="/"
        class="logo"
      >
        <img src="@/assets/article.svg">
        {{ appName }}
      </router-link>
      <div
        v-if="userLoaded"
        class="nav__items-container hidden-xs"
      >
        <template v-if="loggedIn">
          <router-link
            class="nav__btn"
            to="/blogs"
          >
            Blogi
          </router-link>
          <router-link
            class="nav__btn"
            to="/blogs/user"
          >
            Moje blogi
          </router-link>
          <router-link
            class="nav__btn"
            to="/tags"
          >
            Moje tagi
          </router-link>
          <router-link
            class="nav__btn"
            to="/newsfeed"
          >
            Newsfeed
          </router-link>
          <div
            class="nav__btn"
            @click="logout"
          >
            Wyloguj się
          </div>
        </template>
        <template v-else>
          <router-link
            class="nav__btn"
            to="/login"
          >
            Zaloguj się
          </router-link>
        </template>
      </div>
    </div>
    <div :class="{ 'mobile-nav': true, 'open': mobileMenu }">
      <div @click="mobileMenu = false">
        <template v-if="loggedIn">
          <router-link
            class="mobile-nav__btn"
            to="/blogs/user"
          >
            Moje blogi
          </router-link>
          <router-link
            class="mobile-nav__btn"
            to="/blogs"
          >
            Blogi
          </router-link>
          <div
            class="mobile-nav__btn"
            @click="logout"
          >
            Wyloguj się
          </div>
        </template>
        <template v-else>
          <router-link
            class="mobile-nav__btn"
            to="/login"
          >
            Zaloguj się
          </router-link>
        </template>
      </div>
    </div>
    <router-view class="content-view" />
    <vue-progress-bar />
  </div>
</template>

<script>
import api from './api'

export default {
  data () {
    return {
      appName: process.env.VUE_APP_NAME || 'TAS',
      mobileMenu: false
    }
  },
  computed: {
    userLoaded () { return this.$store.getters.userLoaded },
    loggedIn () { return this.$store.getters.loggedIn },
    username () { return this.loggedIn && this.$store.getters.username }
  },
  methods: {
    async logout () {
      const response = await api.logout()
      if (response.status === 200) {
        this.$store.dispatch('logout')
        this.$router.push({ name: 'homepage' })
      }
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: var(--color-bg);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

a {
  text-decoration: none;
}

.logo {
  line-height: 3rem;
  display: inline-flex;
  font-weight: bold;
  font-size: 18px;
  color: black;
  text-transform: uppercase;
  padding: 0 10px;

  img {
    object-fit: contain;
  }
}

.content-view {
  margin-top: 3rem !important;
  overflow: auto;
  min-height: calc(100vh - 3rem);
}

.show-xs {
  display: none;
}

@media (max-width: 500px) {
  .hidden-xs {
    display: none !important;
  }

  .show-xs {
    display: flex;
  }
}

.nav {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  position: fixed;
  top: 0;
  height: 3rem;
  width: 100%;
  white-space: nowrap;
  border-bottom: 1px solid lightgrey;
  background-color: var(--color-selago);
  z-index: 100;

  &__items-container {
    display: flex;
    align-items: stretch;
    margin-left: auto;
    padding: 0 10px;
  }

  &-hamburger {
    font-size: 32px;
    align-items: center;
    padding: 0 4px;
    margin-left: 6px;
  }

  &__btn {
    display: flex;
    font-size: 0.875rem;
    align-items: center;
    padding: 0 5px;
    color: #2c3e50;
    border-bottom: 3px solid transparent;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.1s ease;
    cursor: pointer;

    &.router-link-exact-active {
      border-bottom-color: #d24b5e;
    }
  }

  &__btn:hover {
    color: black;
    border-bottom-color: #a64452;
  }
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  background: #f7f7fe;
  margin-top: 3rem;
  height: calc(100% - 3rem);
  z-index: 90;
  border-right: 1px solid lightgrey;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);

  @media (max-width: 500px) {
    &.open {
      transform: none;
    }
  }

  &__btn {
    display: flex;
    font-size: 0.875rem;
    align-items: center;
    padding: 15px 5px;
    color: #2c3e50;
    border-left: 3px solid transparent;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.1s ease;
    cursor: pointer;

    &.router-link-exact-active {
      border-left-color: #d24b5e;
      background-color: lightgray;
    }
  }

  &__btn:hover {
    color: black;
    border-left-color: #a64452;
  }
}
</style>
