<template>
  <div class="container">
    <router-link
      v-if="blogs.length === 0"
      tag="div"
      :to="{ name: 'createBlog' }"
      class="message"
    >
      Nie posiadasz żadnych blogów stwórz blog.
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
      <div
        class="icon far fa-trash-alt"
        @click="deleteBlog(blog._id)"
      />
    </div>
    <router-link
      v-if="blogs.length !== 0"
      tag="div"
      :to="{ name: 'createBlog' }"
      class="blog"
    >
      <p>  Stwórz blog </p>
    </router-link>
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
      vm.blogs = response.data.filter(blog => blog.userId === vm.user.id)
    })
  },
  methods: {
    async deleteBlog (blogID) {
      const response = await api.deleteBlog(blogID)
      if (response.status === 200) {
        const index = this.blogs.findIndex(blog => blog._id === blogID)
        this.blogs.splice(index, 1)
      }
    }
  }
}
</script>
