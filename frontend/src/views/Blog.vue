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
      <span> {{ blogName }} </span>
    </p>
    <div>
      <span> Add image </span>
      <form v-on:submit="uploadImage($event)">
        <input type="file" accept="image/*" ref="image-input">
        <input type="text" ref="description-input">
        <button type="submit">Add image</button>
      </form>
    </div>
    <div v-if="images.length !== 0">
      <span> Images </span>
      <div>
        <ul>
          <li v-for="image in images" v-bind:key="image._id">
              <img :src="image.img">
              <span>{{ image.description }}</span>
              <button>Update image</button>
              <button>Delete image</button>
          </li>
        </ul>
      </div>
    </div>
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
      images: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])
    const [ images ] = await Promise.all([
      api.listImagePostsByBlog(to.params.blogId)
    ])

    if (blog.status !== 200) next({ name: 'blogs' })

    next(vm => {
      vm.prevRoutename = from.name
      if (vm.prevRoutename === null || vm.prevRoutename === 'createBlog') {
        vm.prevRoutename = 'userBlogs'
      }
      vm.blogName = blog.data.name
      vm.images = images
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])
    // const [ images ] = await Promise.all([
    //   api.listImagePostsByBlog(to.params.blogId)
    // ])

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
    },

    async uploadImage(event) {
    event.preventDefault()
    let data = {
      'image': this.$refs["image-input"].files[0],
      'description': this.$refs["description-input"].value
    } 

    console.log(data)

    const [ image ] = await Promise.all([
      api.addImagePost(this.blogId, data)
    ])

    if (image.status !== 200) console.log(image.request)
    console.log(this.images.length)
  }
  }
}
</script>
