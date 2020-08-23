import Vue from 'vue'
import App from './App.vue'
import router from './router'
import bus from './bus'

Vue.config.productionTip = false

var vm = new Vue({
  bus,
  router,
  render: h => h(App)
}).$mount('#app')

global.vm = vm