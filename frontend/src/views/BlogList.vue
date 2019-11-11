<template>
  <div class="container">
    <div
      v-if="blogs.length === 0"
      class="modules modules--warn"
    >
      <p class="modules__warn">
        Żaden blog jeszcze nie powstał.
      </p>
    </div>
    <div
      v-for="blog in blogs"
      :key="blog._id"
      :data="blog"
      class="blog"
    >
      <router-link :to="{ name: 'blog', params: { blogId: blog._id }}">
        <p class="modules__warn">
          {{ blog.name }}
        </p>
      </router-link>
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
