<template>
  <div class='profile'>
    <layout>
      <template #main>
        <list>
          <template #list>
            <template  v-if="!loginStatus">
              <input class='item' v-model="username" placeholder="username" @change='inputHandler'>
              <input class='item' v-model='password' placeholder="password" type='password' @change='inputHandler'>
              <div class='item hint' v-if="loginHint">{{ loginHint }}
              </div>
              <div class='item actions'>
                <btn :content='"注册"' @click.native='register()'></btn>
                <btn :content='"登录"' @click.native='login()'></btn>
              </div>
            </template >
            <template  v-else>
              <div class='item'> {{ userInfo.username }}</div>
              <div class='item actions'>
                <btn :content='"写"' @click.native='toEdit()'></btn>
                <btn :content='"分类"' @click.native='toCats()'></btn>
              </div>
              <div class='item hint' v-if="posts.length <= 0">还没有发表过文章</div>
              <div class='item' v-else v-for='post in posts' :key='post.id'>
                <span>{{ post.title }}</span>
                <span class='badge'>{{ postStatus(post.status) }}</span>
                <btn class='to-right' :content='"编辑"' @click.native='edit(post)' :size='0'></btn>
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
import ButtonVue from '../components/Button.vue'
import { request } from '@/shared/Request'
import { mapGetters, mapState } from 'vuex'
import { getPostStatus } from '@/shared/dataMap'

export default {
  name: 'profile',
  data () {
    return {
      username: '',
      password: '',
      loginHint: '',
      posts: '',
    }
  },
  components: {
    Loading,
    'layout': Layout,
    'list': List,
    'rbox': Rbox,
    'btn': ButtonVue
  },
  created () {
  },
  mounted () {
    if (this.loginStatus) this.init()
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
      this.getAndSetUserInfo()
      this.getPosts()
    },
    inputHandler () {
      this.loginHint = undefined
    },
    async register () {
      let payload = { username: this.username, password: this.password }
      const res = await request('auth/register', 'POST', JSON.stringify(payload))
      if (res.errno == 'registered') {
        console.log('registered')
      } else {
        this.loginSuccessHandler(res)
      }
    },
    login () {
      let payload = { username: this.username, password: this.password }
      request('auth/login', 'POST', JSON.stringify(payload))
      .then(res => {
        if (res.statusCode == 200) {
          this.loginSuccessHandler(res)
        } else {
          this.loginHint = `ERR: ${ res.message }`
        }
      })
    },
    async loginSuccessHandler (userInfo) {
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
.badge {
  margin-left: 1rem;
  padding: .125rem .5rem;
  border: 1px solid #888;
  border-radius: 1rem;
  font-size: .5rem;
  color: #888;
}
.actions {
  text-align: center;
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