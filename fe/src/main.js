import Vue from 'vue'
import App from './App.vue'
import router from './router'
import bus from './bus'
import { store } from './vuex/main'

Vue.config.productionTip = false

var vm = new Vue({
    store,
    bus,
    router,
    render: h => h(App)
}).$mount('#app')

global.vm = vm
