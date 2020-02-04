<template>
  <div class="container">
    <router-link
      v-if="tags.length === 0"
      tag="div"
      :to="{ name: 'addTag' }"
      class="message"
    >
      Brak tagów, dodaj nowy.
    </router-link>
    <div
      v-for="tag in tags"
      :data="tags"
      class="tag"
    >
      <h1> #{{ tag }} </h1>
      <div
        class="icon far fa-trash-alt"
        @click="deleteTag(tag)"
      />
    </div>
    <router-link
      v-if="tags.length !== 0"
      tag="div"
      :to="{ name: 'addTag' }"
      class="tag"
    >
      <p>  Dodaj tag </p>
    </router-link>
  </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      user: {},
      tags: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const user = await api.getUser()
    next(vm => {
      vm.tags = user.data.tags
    })
  },
  methods: {
    async deleteTag (tag) {
      const response = await api.deleteTag(tag)
      if (response.status === 200) {
        const index = this.tags.indexOf(tag)
        this.tags.splice(index, 1)
      } else {
        // blad
      }
    }
  }
}
</script>
