import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: '#a64452',
  failedColor: 'red'
})

import(/* webpackChunkName: "mainStyle" */ './styles/main.scss')

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
