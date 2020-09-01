
import Vue from 'vue'

export default {
    install(Vue,options) {
        Vue.prototype.$bus = new Vue()
    }
};