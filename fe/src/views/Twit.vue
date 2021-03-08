<template>
  <div id='twit'>
    <layout>

      <template #main>
        <list :loading=intSwitch>
          <template #list>

            <div id='new-twit'>
              <div id='new-twit-input'>
                <pre id='support' v-text='contentInPre'></pre>
                <textarea id='input' class='item' v-model='twit.content' placeholder="content"></textarea>
              </div>
              <div class='item' v-if='twit.files.length'>
                <div class='images'>
                  <div class='image-item' v-for="(file, index) in twit.files" :key=file.name>
                    <img :src='file.data'>
                    <div id='image-control'>
                      <div class='bg'></div>
                      <div class='control' v-if='index > 0' @click='forward(index)'>←</div>
                      <div class='control' v-if='index < twit.files.length-1' @click='backward(index)'>→</div>
                      <div class='control' @click='remove(index)'>×</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class='item'>
                <btn @click='send()'><pro :progress='twit.progress.per'></pro>发送</btn>
                <btn @click='toggleAnonymous()'>{{ sendTwitUserName }}</btn>
                <label>
                  <input id='input-file' ref='inputFile' type="file" accept="image/*" @change="selectImage" multiple>
                  <btn @click='selectImageTrigger'>图片</btn>
                </label>
              </div>
            </div>

            <div class="item" v-for="(t, index) in data" :key="index">
              <div class='meta'>
                <div class="name">{{t.user.username}}</div>
                <div class="date">{{t.created_time}}</div>
              </div>
              <div class="content" v-html="t.content"></div>
              <div class='images' v-if='t.files.length'>
                <div class='image-item' v-for="f in t.files" :key=f._id>
                  <img :src='f.thumb'>
                </div>
              </div>
              <div class='op'>
                <div class='show-replies' @click='showReplies(t)'>
                </div>
              </div>
              <div class='replies' v-if='t.showReplies'>
                <div class='reply'>
                  <btn class='send-reply' :mr=0 @click='sendReply()'>发送</btn>
                  <textarea v-model="reply.content" :placeholder="replyPlaceHolder"></textarea>
                </div>
                <div class='wrapper'>
                  <div v-for='r in replies' :key='r._id' class='reply-entry' @click='replyToReply(r)'>
                    <div class='name'>{{ r.user.username }}</div>:
                    <div class='content'>{{ r.content }}</div>
                  </div>
                </div>
              </div>
              <!-- <div class="opmenu">
                <div class='comments' @click='setReplyTo(item)'>
                  <div class='icon' style='width:1.25rem'></div>
                  <div class='num'>{{item.child.length === 0 ? '' : item.child.length}}</div>
                </div>
                <div class='addreact'>＋
                  <div class='list'>
                    <div class='addreact-item' v-for="(val, key) in map" :key="val" @click='react(item, key)'>{{val}}</div>
                  </div>
                </div>
                <div class='react'>
                  <div v-for='(val, key) in itemReact(item)' :key='key' class='added'>
                    {{map[key]}}{{val}}
                  </div>
                </div>
              </div>
              <div v-for="(child, index) in item.child" :key='index' class="item item-child">
                <div class='meta'>
                  <div class="name">{{child.author_name}}</div>
                  <div class="date">{{slicedDate(child.date)}}</div>
                </div>
                <div class="content" v-html="child.content.rendered" @click="clickbub($event)"></div>
              </div> -->
            </div>

          </template>
        </list>
      </template>

    </layout>
  </div>
</template>

<script>
import Layout from '@/components/Layout.vue'
import Rbox from '@/components/Rbox.vue'
import List from '@/components/List.vue'
import Loading from '@/components/Loading.vue'
import { Button, Progress } from '@/components/Button.js'
import { mapGetters } from 'vuex'
import { readFile } from '@/shared/helper'
import { request } from '../shared/Request'
import { ip } from '@/shared/config'

export default {
  name: 'twit',
  data () {
    return {
      twit: {
        content: '',
        files: [],
        parent: null,
        ancestor: null,
        progress: {
          per: 0
        },
        anonymous: true,
      },
      data: [],
      curPage: 0,
      intSwitch: 0,
      mainNode: undefined,
      listNode: undefined,
      data: [],
      max_page: 101,
      addOpen: false,
      large_device: true,
      reactdata: [],
      toParent: 0,
      reply: {
        content: '',
        parent: null,
        parentName: null,
        ancestor: null,
        opened: null
      },
      replies: [],
      twitShowReplies: null,
      map: {
        'gd': '🉑',
        'zn': '👍',
        'sh': '💩',
        'nm': '🍋',
        'ca': '👎',
        'wh': '❓',
        'ha': '🐸',
        'gt': '❗',
        'hp': '😨',
        'dg': '🐶',
        'tt': '🍭',
        'qq': '😘'
      },
    }
  },
  components: {
    'layout': Layout,
    'rbox': Rbox,
    'list': List,
    'btn': Button,
    'pro': Progress,
  },
  created () {
    this.fetchTwits(this.curPage)
    this.setDevice()
    window.addEventListener('resize', () => {
      this.setDevice()
    })
  },
  mounted () {
    this.mainNode = document.getElementsByClassName('main')[0]
    this.mainNode.addEventListener('scroll', this.scrollBottom)
    this.listNode = document.getElementsByClassName('list')[0]
  },
  computed: {
    replyPlaceHolder () { return `回复给${ this.reply.parent_name } : ${ this.reply.replyToContent}` },
    sendTwitUserName () { return this.twit.anonymous ? 'anonymous' : this.userInfo.username },
    contentInPre () {
      // I met strange problem, last newline in PRE not showing, so add an extra newline manually.
      return this.twit.content + '\n'
    },
    toParentName () {
      let item = this.data.find(v => v.id === this.toParent)
      return item === undefined ? '' : item.author_name
    },
    userInfo () { return this.$store.getters.userInfo },
    itemReact () {
      return (item) => {
        let pair = this.reactdata.find(v => v.id == item.id)  // v.id is str, use ==
        return pair === undefined ? [] : pair.react
      }
    },
    slicedContent () {
      return function (content) {
        let plain = content.replace(/<[^>]*>/g, '')
        return plain
      }
    },
    slicedDate () {
      return function (d) {
        let ds = d.split(/[-T:]/)
        ds[0] = ds[0].slice(2, 4)
        ds = ds.slice(0, -1)
        ds = ds.slice(0,3).join('-') + ' ' + ds.slice(3,5).join(':')
        return ds
      }
    },
  },
  methods: {
    forward (index) {
      let files = this.twit.files
      if (index > 0) {
        const f = files.splice(index, 1)
        files.splice(index - 1, 0, ...f)
      }
      console.log(files)
    },
    backward (index) {
      let files = this.twit.files
      if (index < files.length - 1) {
        const f = files.splice(index, 1)
        files.splice(index + 1, 0, ...f)
      }
    },
    remove (index) {
      this.twit.files.splice(index, 1)
    },
    selectImageTrigger () {
      this.$refs.inputFile.click()
    },
    async selectImage () {
      if (!this.$refs.inputFile.files?.length && this.twit.files.length >= 3) return
      const inputFiles = [...this.$refs.inputFile.files]
      let fileObjs = await Promise.all(
        inputFiles.map(
          async f => {
            return { data: await readFile(f), blob: f }
          }
        )
      )
      this.twit.files.push(...fileObjs)
    },
    fetchReact () {
      fetch(window.domain + '/react/react.php')
      .then(res => {return res.json()})
      .then(json => {
        this.reactdata = json
      })
    },
    react (item, key) {
      let react
      if (item.meta.react === '') {
        react = {}
      } else {
        react = item.meta.react
      }
      if (key in react) {
        react[key] = react[key] + 1
      } else {
        react[key] = 1
      }
      item.meta.react = react
      let react_str = JSON.stringify(react)
      let form = new FormData()
      form.append('id', item.id)
      form.append('rid', key)
      fetch(window.domain + '/react/react.php', {
        method: 'POST',
        body: form
      })
      .then(res => {return res.json()})
      .then(json => {
        this.reactdata = json
      })
    },
    scrollBottom () {
      if (this.$route.path != '/twit') return
      if (this.intSwitch == 0 && this.mainNode.scrollTop + this.mainNode.clientHeight >= this.listNode.clientHeight + 48) {
        let pageToFetch = Math.ceil(this.data.length / 10.0 + 1)
        this.fetchTwits(pageToFetch)
      }
    },
    clickbub (e) {
      if (e.target.nodeName === 'IMG') {
        if (e.target.style.maxWidth === '100%') {
          e.target.style.maxWidth = '30%'
        } else {
          e.target.style.maxWidth = '100%'
        }
      }
    },
    setReplyTo (item) {
      this.toParent = item.id
      if (!this.large_device) {
        this.addOpen = true
      }
    },
    setDevice () {
      this.large_device = document.documentElement.clientWidth > 750 
    },
    clearComment () {
      this.data = []
      this.max_page = 1000
    },
    async fetchTwits (page) {
      let twits = await request(`twit/${ page }`, null, null, { upload: true, progress: this.twit.progress })
      twits.map(t => {
        const date = new Date(t.created_time)
        t.content = t.content.replace(/\n/g, '<br>')
        t.created_time = `${ date.toLocaleDateString() } ${ date.toLocaleTimeString(undefined, {hour12: false}) }`
        t.files.map(f => { 
          f.url = `${ ip }${ f.url }`;
          f.thumb = `${ ip }${ f.thumb }`;
        })
        t.showReplies = false
      })
      this.data.push(...twits)
    },
    replyToReply () {
      // this.reply.
    },
    async showReplies (t) {
      if (t.showReplies) {
        t.showReplies = false
        this.reply.opened = null
      } else {
        if (this.reply.opened) this.reply.opened.showReplies = false
        this.reply.opened = t;
        t.showReplies = true;
        this.reply.ancestor = this.reply.parent = t._id;
        this.reply.parentName = t.user.username
        let replies = await request(`twit/replies/${ t._id }`)
        this.replies = replies
      }
    },
    fetchChildComments (allparent) {
      fetch(window.ip + 'comments?post=' + 53 + '&parent=' + allparent.join(','))
      .then(res => {return res.json()})
      .then(json => {
        json.map(v => {
          for (let i in this.data) {
            if (this.data[i].id === v.parent) {
              if (this.data[i].child === undefined) {
                this.data[i].child = [v]
              } else {
                this.data[i].child.push(v)
              }
            }
          }
        })
      })
    },
    async sendReply () {
      let r = this.reply
      if (r.content.length < 1 || !r.ancestor || !r.parent) {
        this.$store.commit('notify', { content: '内容不能为空' }); return;
      }
      let fd = new FormData()
      fd.append('content', this.reply.content)
      fd.append('parent', this.reply.parent)
      fd.append('ancestor', this.reply.ancestor)
      let res = await request('twit', 'POST', fd)
      this.$store.commit('notify', { content: '发送成功' })
    },
    async send () {
      let t = this.twit
      if (t.content == '') {
        this.$store.commit('notify', { content: '内容不能为空' }); return;
      }
      this.$store.commit('notify', { content: '发送中' })
      let fd = new FormData()
      fd.append('content', t.content)
      t.files.map(f => fd.append('files', f.blob))
      if (t.parent) fd.append('parent', null)
      if (t.ancestor) fd.append('ancestor', undefined)
      let res = await request('twit', 'POST', fd, { upload: true, progress: this.twit.progress })
      this.$store.commit('notify', { content: '发送成功' })
    },
    toggleAnonymous () {
      if (this.userInfo.username) {
        this.twit.anonymous = !this.twit.anonymous
      } else {
        this.$store.commit('notify', { content: '登录后可以使用用户名发言' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
#new-twit {
  .item {
    border: none;
    border-top: 1px solid #eee;
  }
  #new-twit-input {
    position: relative;
    #support {
      margin: 0;
      padding: 1rem 2rem;
      min-height: 1.25rem;
      visibility: hidden;
      border-top: 1px solid transparent;
      word-wrap: break-word;
      white-space: pre-wrap;
      font-size: .875rem;
      text-align: left;
      font-family: inherit;
      line-height: 1.25rem;
    }
    #input {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      border-bottom: none;
      height: calc(100% - 2rem - 1px);
      overflow: hidden;
    }
  }
  #input-file {
    display: none;
  }
}
.images {
  display: grid;
  margin-bottom: .5rem;
  grid-template-columns: repeat(auto-fill, 32%);
  grid-row-gap: .5rem;
  justify-content: space-between;
  .image-item {
    position: relative;
    // padding/margin-top/bottom在设置百分比值时针对父元素width，用来模拟正方形。这里因为是grid，所以只要设置100%，不用32%。
    padding-bottom: 100%;
    width: 100%;
    height: 0;
    overflow: hidden;
    border-radius: .5rem;
    img {
      display: block;
      width: 100%;
    }
    &:hover #image-control {
      opacity: 1;
    }
    #image-control {
      position: absolute;
      right: .25rem;
      top: .25rem;
      border-radius: .5rem;
      opacity: 0;
      overflow: hidden;
      transition: opacity .2s ease-in-out;
      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: white;
        opacity: .7;
        backdrop-filter: blur(30px);
      }
      .control {
        position: relative;
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        transition: background-color .2s ease;
        &:hover {
          background-color: #eee;
          opacity: .5;
        }
      }
    }
  }
}
.item {
  .meta {
    .name, .date {
      display: inline-block;
      margin: 0 1rem 0 0;
      font-size: .9375rem;
    }
    .name {
      font-weight: bold;
    }
    .date {
      color: #999;
      font-size: .8125rem;
    }
  }
  .content {
    position: relative;
    margin-top: .5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    word-break: break-all;
  }
  .images {
    margin-top: .5rem;
  }
  .op {
    margin-top: .5rem;
    .show-replies {
      width: 1.25rem;
      height: 1.25rem;
      background-image: url('../../public/reply.svg');
      background-size: contain;
      cursor: pointer;
    }
  }
  .opmenu {
    margin-top: .5rem;
    display: flex;
    height: 1.25rem;
    line-height: 1.25rem;
    color: #888;
    font-size: 15px;
    user-select: none;
    .comments {
      flex: 0 0 auto;
      width: 3rem;
      cursor: pointer;
      .icon {
        display: inline-block;
        height: 20px;
        vertical-align: middle;
      }
      .num {
        display: inline-block;
        margin-left: .25rem;
        height: 20px;
        vertical-align: middle;
      }
    }
    .addreact {
      position: relative;
      flex: 0 0 auto;
      width: 2rem;
      font-size: 16px;
      cursor: pointer;
      text-align: center;
      &:hover .list {
        display: flex;
      }
      .list {
        position: absolute;
        display: none;
        flex-wrap: wrap;
        padding: .5rem;
        width: 8rem;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: .5rem;
        cursor: pointer;
        z-index: 1;
        .addreact-item {
          flex: 0 0 auto;
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
        }
      }
    }
    .react {
      position: relative;
      display: flex;
      flex: 1 1 auto;
      height: 1.5rem;
      vertical-align: top;
      flex-wrap: nowrap;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      .added {
        flex: 0 1 auto;
        margin-right: .75rem;
        text-align: center;
        white-space: nowrap;
      }
    }
  }
  .replies {
    margin-top: .5rem;
    .reply {
      position: relative;
      margin-bottom: .25rem;
      textarea {
        width: calc(100% - 5rem);
        padding: .5rem 1rem;
        padding-right: 4rem;
        background-color: #eee;
        border-radius: 1rem;
      }
      .send-reply {
        position: absolute;
        top: .25rem;
        right: .25rem;
      }
    }
    .wrapper {
      .reply-entry {
        padding: .125rem .5rem;
        border-radius: .25rem;
        cursor: pointer;
        &:hover {
          background-color: #eee;
          transition: .2s ease;
        }
        .name { display: inline; }
        .content { display: inline; }
      }
    }
  }
}
</style>