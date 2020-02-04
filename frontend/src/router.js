import Vue from 'vue'
import Router from 'vue-router'
import store from './store/'
import api from './api'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'homepage',
      meta: { loginNotRequired: true },
      component: () => import(/* webpackChunkName: "home" */ './views/Homepage.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import(/* webpackChunkName: "blogs" */ './views/BlogList.vue')
    },
    {
      path: '/blogs/user',
      name: 'userBlogs',
      component: () => import(/* webpackChunkName: "blogs" */ './views/UserBlogList.vue')
    },
    {
      path: '/blogs/create',
      name: 'createBlog',
      component: () => import(/* webpackChunkName: "blogs" */ './views/CreateBlog.vue')
    },
    {
      path: '/blogs/:blogId',
      name: 'blog',
      component: () => import(/* webpackChunkName: "blog" */ './views/Blog.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "blogs" */ './views/TagList.vue')
    },
    {
      path: '/tags/add',
      name: 'addTag',
      component: () => import(/* webpackChunkName: "blogs" */ './views/AddTag.vue')
    },
    {
      path: '/newsfeed',
      name: 'newsfeed',
      component: () => import(/* webpackChunkName: "blogs" */ './views/UserNewsfeed.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.userLoaded) {
    const response = await api.getUser()
    store.dispatch('login', response.data)
  }

  if (!store.getters.loggedIn) {
    if (to.matched.some(record => record.meta.loginNotRequired)) {
      return next()
    }

    return next('/login')
  } else if (to.matched.some(record => record.meta.blockIfLoggedIn)) {
    return next('/blogs')
  }

  next()
})

export default router
