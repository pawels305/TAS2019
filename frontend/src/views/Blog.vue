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
    <div class="content">
      <span> Add image </span>
      <form v-on:submit="uploadImage($event)">
        <input type="file" accept="image/*" ref="image-input" @change="onImageChange()">
        <br />
        <input type="text" ref="description-input" placeholder="Add description" @change="onTextChange()">
        <br />
        <button type="submit">Add image</button>
        <br /><br />
      </form>
    </div>
    <div v-if="images.length !== 0" class="content">
      <span> Images </span>
      <div>
        <ul>
          <li v-for="image in images" v-bind:key="image._id">
              <img :src="image.img.data">
              <br />
              <span>{{ image.description }}</span>
              <br />
              <!-- <button>Update image</button> -->
              <button @click="deleteImage(image._id)">Delete image</button>
              <br /><br />
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
      images: [],
      tag: this.$route.params.tag
    }
  },
  async beforeRouteEnter (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])
    const [ images ] = await Promise.all([
      api.listImagePostsByBlog(to.params.blogId)
    ])
    console.log(images.data)

    if (blog.status !== 200) next({ name: 'blogs' })

    next(vm => {
      vm.prevRoutename = from.name
      if (vm.prevRoutename === null || vm.prevRoutename === 'createBlog') {
        vm.prevRoutename = 'userBlogs'
      }
      vm.blogName = blog.data.name
      vm.images = images.data
      vm.blogTag = blog.data.tag
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

    onImageChange() {
        let image = this.$refs["image-input"].files[0]
        this.image = image
    },

    onTextChange() {
        let text = this.$refs["description-input"].value
        this.description = text
    },

    async deleteImage(id) {
      const [ image ] = await Promise.all([
        api.deleteImagePost(id)
      ])
      if (image.status !== 200) console.log(image.request)
      window.location.reload()
    },

    async uploadImage(event) {
      event.preventDefault();
      // let data = {
      //   'image': this.$refs["image-input"].files[0],
      //   'description': this.$refs["description-input"].value
      // }

      const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      });

      this.image = await toBase64(this.image)

      let data = {
      'image': this.image,
      'description': this.description
      }

      const [ image ] = await Promise.all([
        api.addImagePost(this.blogId, data)
      ])

      if (image.status !== 200) console.log(image.request)
      // console.log(this.images.length)
      window.location.reload()
    }
  }
}
</script>
<style>
  li {
      list-style-type: none;
  }
  .content {
  max-width: 500px;
  margin: auto;
  }
</style>
