import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import './plugins/element.js'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
