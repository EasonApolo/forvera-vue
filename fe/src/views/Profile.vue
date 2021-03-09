<template>
  <div class='profile'>
    <layout>
      <template #main>
        <list>
          <template #list>
            <template  v-if="!loginStatus">
              <input class='item' v-model="username" placeholder="username">
              <input class='item' v-model='password' placeholder="password" type='password' @keyup.enter="login()">
              <div class='item actions'>
                <btn @click='register()'>注册</btn>
                <btn @click='login()'>登录</btn>
              </div>
            </template >
            <template  v-else>
              <div class='item'>
                <span>{{ userInfo.username }}</span>
                <btn id='btn-logout' :mr=0 @click='logout'>登出</btn>
              </div>
              <div class='item actions'>
                <btn @click='toEdit()'>写作</btn>
                <btn @click='toCats()'>分类</btn>
              </div>
              <div class='item hint' v-if="posts.length <= 0">还没有发表过文章</div>
              <div class='item' v-else v-for='post in posts' :key='post.id'>
                <span>{{ post.title }}</span>
                <badge>{{ postStatus(post.status) }}</badge>
                <btn class='to-right' @click='edit(post)' :size='0'>编辑</btn>
              </div>
            </template >
          </template>
        </list>
      </template>
      <template #right>
        <rbox :title='""'>
          <template #list>
          </template>
        </rbox>
      </template>
    </layout>
  </div>
</template>

<script>
import Layout from '@/components/Layout.vue'
import Rbox from '@/components/Rbox.vue'
import List from '@/components/List.vue'
import Loading from '@/components/Loading.vue'
import { Button } from '../components/Button.js'
import { request } from '@/shared/Request'
import { mapGetters, mapState } from 'vuex'
import { getPostStatus } from '@/shared/dataMap'
import { Badge } from '@/components/Badge.js'

export default {
  name: 'profile',
  data () {
    return {
      username: '',
      password: '',
      posts: '',
    }
  },
  components: {
    Loading,
    'layout': Layout,
    'list': List,
    'rbox': Rbox,
    'btn': Button,
    'badge': Badge,
  },
  created () {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.init())
  },
  mounted () {
  },
  computed: {
    loginStatus () { return this.$store.state.login },
    ...mapGetters([
      'userInfo',
    ]),
    postStatus: () => getPostStatus
  },
  methods: {
    init () {
      if (this.loginStatus) {
        this.getAndSetUserInfo()
        this.getPosts()
      }
    },
    invalidForm () {
      if (this.username.length == 0 || this.password.length == 0) {
        this.$store.commit('notify', { content: '用户名或密码不能为空' });
        return true
      }
    },
    handle409 () {
      this.$store.commit('notify', { content: `E409: 用户名已存在`, type: 'warning' });
    },
    handle401 () {
      this.$store.commit('notify', { content: `E401: 用户名/密码错误`, type: 'warning' });
    },
    async register () {
      if (this.invalidForm()) return
      let payload = { username: this.username, password: this.password }
      const res = await request('auth/register', 'POST', JSON.stringify(payload))
      if (res.ERRNO == 409) { this.handle409() }
      else { this.loginSuccessHandler(res) }
    },
    async login () {
      if (this.invalidForm()) return
      let payload = { username: this.username, password: this.password }
      this.$store.commit('notify', { content: '登录中' })
      let res = await request('auth/login', 'POST', JSON.stringify(payload))
      if (res.ERRNO == 401) { this.handle401() }
      else { this.loginSuccessHandler(res) }
    },
    logout () {
      this.$store.commit('setToken', undefined)
      this.$store.commit('login', false)
      this.$store.commit('notify', { content: '已登出' })
    },
    async loginSuccessHandler (userInfo) {
      this.$store.commit('notify', { content: '登录成功' })
      this.$store.commit('login', true)
      const newToken = `Bearer ${userInfo.token}`
      this.$store.commit('setToken', newToken)
    },
    async getAndSetUserInfo () {
      let userInfo = await request('user/info', 'POST')
      this.$store.commit('setUserInfo', userInfo)
    },
    async getPosts () {
      let posts = await request('post/user', 'POST')
      posts.map(post => {
        if (!post.title) post.title = '(无标题)'
      })
      this.posts = posts
    },
    toEdit () {
      this.$router.push({ path: 'edit' })
    },
    toCats () {
      this.$router.push({ path: 'cats'})
    },
    edit (post) {
      this.$router.push({ name: 'edit', params: { _id: post._id } })
    }
  },
  watch: {
    loginStatus (newStatus, oldStatus) {
      if (newStatus) {
        this.init()
        this.getAndSetUserInfo()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.hint {
  font-size: .5rem;
  color: rgb(253, 121, 121)
}
#btn-logout {
  float: right;
}
.actions {
  & div {
    margin: 0 .5rem;
  }
}
.to-right {
  margin: 0 0 0 1rem !important;
  float: right;
}
@media (max-width: 750px) {
}
</style>