import Vue from 'vue'
import App from './App.vue'
import router from './router'
import bus from './shared/bus'
import { store } from './store'

Vue.config.productionTip = false

var vm = new Vue({
    store,
    bus,
    router,
    render: h => h(App)
}).$mount('#app')

global.vm = vm
