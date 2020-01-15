<template>
  <div>
    <div class="container">
      <div
        v-if="blogs.length === 0"
        class="blogs blogs--warn"
      >
        <p class="blogs__warn">
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
          <p class="blogs__warn">
            {{ blog.name }}
          </p>
        </router-link>
      </div>
    </div>
    <div class="pages">
      Wybierz strone
      <select
        v-model="page"
        @change="changePage(page)"
      >
        <option
          v-for="index in pages"
          :key="index"
        >
          {{ index }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      blogs: [],
      pages: 1,
      page: 1
    }
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listBlogs(1)
    next(vm => {
      vm.blogs = response.data.blogs
      vm.pages = Math.ceil(response.data.length / 10)
    })
  },
  methods: {
    async changePage (page) {
      const response = await api.listBlogs(page)
      this.page = page
      this.blogs = response.data.blogs
    }
  }
}
</script>

<style lang="scss" scoped>
  .pages {
    width: 80%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
</style>
