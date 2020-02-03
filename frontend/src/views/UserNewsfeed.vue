<template>
  <div class="container">
    <router-link
      v-if="blogs.length === 0"
      tag="div"
      :to="{ name: 'addTag' }"
      class="message"
    >
      Pusto, dodaj tagi.
    </router-link>
    <div
      v-for="blog in blogs"
      :key="blog._id"
      :data="blog"
      class="blog"
    >
      <router-link
        :to="{ name: 'blog', params: { blogId: blog._id }}"
      >
        <p>  {{ blog.name }} </p>
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      user: {},
      blogs: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listBlogs()
    const user = await api.getUser()
    next(vm => {
      vm.user = user.data
      vm.blogs = response.data.filter(blog => vm.user.tags.includes(blog.tag))
    })
  }
}
</script>
