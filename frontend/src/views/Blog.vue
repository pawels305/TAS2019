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
    <div class="content">
    <form v-on:submit="addComment()">
        <input type="text" ref="comment-input" placeholder="Write comment" @change="onTextChange()">
        <br />
        <button type="submit">Add comment</button>
        <br /><br />
      </form>
      </div>
    <div v-if="comments.length !== 0" class="content">
      <span> Comments </span>
      <div>
        <ul>
          <li v-for="comment in comments" v-bind:key="comment._id">
              <span>{{ comment.commentBody }}</span>
              <br />
              <button @click="deleteComment(comment._id)">Delete comment</button>
              <br /><br />
               <div
                  class="icon far fa-edit"
                  @click="edit(comment._id)"
              />

              <div v-if="editComment">
      <form
        method="put"
        @submit.prevent="updateComment"
        @keyup.native.enter="updateComment"
      >
        <h4>Zmien komentarz</h4>
        <input
          id="blogName"
          v-model="editCommentBody"
          type="text"
          name="blogName"
          placeholder="New comment"
          require
        >
        <button type="submit">
          Dodaj komentarz
        </button>
        <br /><br />
      </form>
    </div>
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
      tag: this.$route.params.tag,
      comments: [], 
      editComment: false,
      editCommentBody: '',
      commentID: '',
    }
  },
  async beforeRouteEnter (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])
    const [ images ] = await Promise.all([
      api.listImagePostsByBlog(to.params.blogId)
    ])

    const [ comments ] = await Promise.all([
      api.listCommentsByBlog(to.params.blogId)
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
      vm.comments = comments.data
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const [ blog ] = await Promise.all([
      api.getBlog(to.params.blogId)
    ])

    const [ comments ] = await Promise.all([
      api.listCommentsByBlog(to.params.blogId)
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
    },

    edit (commentId) {
      this.commentID = commentId
      this.editComment = true
    },

    async addComment () {
      let data = {
      'commentBody': this.$refs["comment-input"].value
      }

      const [ comment ] = await api.addComment([
        api.addComment(this.blogId, data)
      ])
      if (comment.status !== 200) console.log(comment.request)
      window.location.reload()
    },

    async deleteComment(id) {
      const [ comment ] = await Promise.all([
        api.deleteComment(id)
      ])
      if (comment.status !== 200) console.log(comment.request)
      window.location.reload()
    },

    async updateComment () {
      const response = await api.updateComment(this.commentID, { commentBody: this.editCommentBody })
      if (response.status === 200) {
        const index = this.comments.findIndex(comment => comment._id === this.commentID)
        this.comments[index].commentBody = this.editCommentBody
        this.editCommentBody = ''
        this.commentID = ''
        this.editComment = false
      }
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
