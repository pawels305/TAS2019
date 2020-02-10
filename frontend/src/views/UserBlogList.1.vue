<template>
  <div>
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
        <div
          class="icon far fa-edit"
          @click="edit(blog._id)"
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
    <div v-if="editBlog">
      <form
        method="put"
        @submit.prevent="updateBlog"
        @keyup.native.enter="updateBlog"
      >
        <h2>Zmień nazwę</h2>
        <input
          id="blogName"
          v-model="editName"
          type="text"
          name="blogName"
          placeholder="Nazwa Bloga"
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
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      user: {},
      blogs: [],
      editBlog: false,
      editName: '',
      error: '',
      blogID: ''
    }
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listBlogs(-1)
    const user = await api.getUser()
    next(vm => {
      vm.user = user.data
      vm.blogs = response.data.filter(blog => blog.userId === vm.user.id)
    })
  },
  methods: {
    edit (blogId) {
      this.blogID = blogId
      this.editBlog = true
    },
    async deleteBlog (blogID) {
      const response = await api.deleteBlog(blogID)
      if (response.status === 200) {
        const index = this.blogs.findIndex(blog => blog._id === blogID)
        this.blogs.splice(index, 1)
      }
    },
    async updateBlog () {
      const response = await api.updateBlog(this.blogID, { name: this.editName })
      if (response.status === 200) {
        const index = this.blogs.findIndex(blog => blog._id === this.blogID)
        this.blogs[index].name = this.editName
        this.editName = ''
        this.blogID = ''
        this.editBlog = false
      } else {
        this.error = 'nazwa zajęta'
      }
    }
  }
}
</script>
