<template>
  <div>
    <div
      v-if="blogs.length === 0"
      class="modules modules--warn"
    >
      <p class="modules__warn">
        Dodaj bloga żeby działać na tej strone
      </p>
    </div>
    <div
      v-for="blog in blogs"
      :key="blog.id"
      :data="blog"
    >
      <p class="modules__warn">
        {{ blog.name }}
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      blogs: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listBlogs()
    next(vm => {
      vm.blogs = response.data
    })
  }
}
</script>
