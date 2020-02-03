<template>
  <div>
    <div class="return">
      <router-link
        class="return__btn"
        :to="{ name: prevRoutename }"
      >
        <i class="fas fa-arrow-left arrow" />
        Powrót
      </router-link>
    </div>
    <p>
      <span> {{ blogName }}</span>
    </p>
    <p>
      <span> tag: {{ blogTag }}</span>
    </p>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      prevRoutename: null,
      blogId: this.$route.params.blogId,
      blogName: '',
      tag: this.$route.params.tag
    }
  },
  async beforeRouteEnter (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])

    if (blog.status !== 200) next({ name: 'blogs' })

    next(vm => {
      vm.prevRoutename = from.name
      if (vm.prevRoutename === null || vm.prevRoutename === 'createBlog') {
        vm.prevRoutename = 'userBlogs'
      }
      vm.blogName = blog.data.name
      vm.blogTag = blog.data.tag
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])

    if (blog.status !== 200) next({ name: 'blogs' })
    this.blogName = blog.data.name
    next()
  },
  async getEvent (to, from, next) {
    const response = await api.getEvent(this.eventId)

    if (response.status === 200) {
      alert(response.data)
    } else this.error = 'Coś poszło nie tak, spróbuj ponownie'
  },
  methods: {
    removeModule (moduleId) {
      const index = this.modules.findIndex(module => module.id === moduleId)
      this.modules.splice(index, 1)
    }
  }
}
</script>
