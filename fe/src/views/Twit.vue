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
              <div id='preview' class='item' v-if='twit.files.length'>
                <div class='preview-item' v-for="file in twit.files" :key=file.name>
                  <img :src='file.data'>
                </div>
              </div>
              <div class='item'>
                <label>
                  <input id='input-file' ref='inputFile' type="file" accept="image/*" @change="selectImage" multiple>
                  <btn @click='selectImageTrigger'>选择</btn>
                </label>
                <btn @click='send()'><pro :progress='twitProgress'></pro>发送</btn>
                <span>{{ userInfo.username }}</span>
              </div>
            </div>
            <div class="item" v-for="(item, index) in data" :key="index">
              <div class='meta'>
                <div class="name">{{item.author_name}}</div>
                <div class="date">{{slicedDate(item.date)}}</div>
              </div>
              <div class="content" v-html="item.content.rendered" @click="clickbub($event)"></div>
              <div class="opmenu">
                <div class='comments' @click='setReplyTo(item)'>
                  <div class='icon' style='width:1.25rem'><svg viewBox="0 0 24 24"><path fill='#ccc' d='M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z'></path></svg></div>
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
              </div>
            </div>
          </template>
        </list>
      </template>
      <template #right>
        <rbox :title='"回复"'>
          <template #list>
            <input class='item' type='text' v-model='name' placeholder="君の名は">
            <textarea class='item' type='text' v-model='content' placeholder="言叶" rows="10"></textarea>
            <div class='item replyto' v-show="toParent != 0" @click='toParent=0'>回复给<i>{{toParentName}}</i><br>（点击取消）</div>
            <!-- <button class="close" v-show="addOpen" @click="addOpen=false"></button> -->
            <div class='item plain'><button @click="send"></button></div>
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
import { Button, Progress } from '@/components/Button.js'
import { mapGetters } from 'vuex'
import { readFile } from '@/shared/helper'
import { request } from '../shared/Request'

export default {
  name: 'twit',
  data () {
    return {
      twit: {
        content: '',
        files: [],
        parent: null,
        ancestor: null,
      },
      twitProgress: 0,
      intSwitch: 0,
      mainNode: undefined,
      listNode: undefined,
      data: [],
      max_page: 101,
      name: localStorage.name || '',
      content: localStorage.content || '',
      addOpen: false,
      large_device: true,
      reactdata: [],
      toParent: 0,
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
    this.fetchComment(1)
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
    selectImageTrigger () {
      this.$refs.inputFile.click()
    },
    async selectImage () {
      if (!this.$refs.inputFile.files?.length && this.twit.files.length >= 9) return
      const inputFiles = [...this.$refs.inputFile.files]
      let fileObjs = await Promise.all(
        inputFiles.map(
          async f => {
            return { data: await readFile(f), blob: f }
          }
        )
      )
      console.log(fileObjs)
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
        this.fetchComment(pageToFetch)
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
    fetchComment (page) {
      if (page > this.max_page) return    // reject request if page beyond max_page
      this.intSwitch = 1
      fetch(window.ip + 'comments?post=' + 53 + '&page=' + page + '&parent=0')
      .then(res => {
        return res.json()
      }).then(json => {
        if (json.length == 0) {
          this.max_page = page - 1
        }
        json.map(v => {v.child = []})
        this.data = this.data.concat(json)
        this.intSwitch = 0
        let allparent = json.map(v => v.id)
        this.fetchChildComments(allparent)
        this.fetchReact()
      })
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
    async send () {
      let t = this.twit
      if (t.content == '') {
        this.$store.commit('notify', { content: '内容不能为空' }); return;
      }
      this.$store.commit('notify', { content: '发送中' })
      let form = new FormData()
      form.append('content', t.content)
      if (t.files.length > 0)form.append('files', [])
      if (t.parent) form.append('parent', null)
      if (t.ancestor) form.append('ancestor', undefined)
      let res = await request('twit', 'POST', form)
      console.log(res)
      this.$store.commit('notify', { content: '发送成功' })
      // fetch(window.ip + 'comments', {
      //   method: 'POST',
      //   body: form
      // }).then(() => {
      //   this.toParent = 0
      //   this.addOpen = false
      //   this.clearComment()
      //   this.$bus.$emit('pop', '已发送')
      //   this.intSwitch = 1
      //   this.fetchComment(1)
      // })
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
      // visibility: hidden;
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
  #preview {
    display: flex;
    width: calc(100% - 4rem);
    flex-wrap: wrap;
    .preview-item {
      flex: 0 0 auto;
      width: 33.3%;
      height: 0;
      padding-bottom: 33.3%;
      text-align: center;
      overflow: hidden;
      img {
        width: 95%;
      }
    }
  }
  #input-file {
    display: none;
  }
}
.item {
  padding: 1rem 2rem;
  background-repeat: no-repeat;
  &:hover {
    background-color: #fafafa;
  }
  .meta {
    .name, .date {
      display: inline-block;
      margin: 0 1rem .5rem 0;
      font-size: .9375rem;
    }
    .name {
      font-weight: bold;
    }
    .date {
      color: #999;
      font-size: .8125rem;
    }
    .reply {
      font-size: .8125rem;
    }
  }
  .content {
    position: relative;
    font-size: 0.875rem;
    line-height: 1.75rem;
    word-break: break-all;
    /deep/ p {
      margin: 0;
    }
    /deep/ a {
      text-decoration: underline;
      color: #88f;
    }
    /deep/ img {
      display: block;
      margin: .5rem 0;
      max-width: 30%;
      border-radius: 1.25rem;
      transition: .2s ease-in-out;
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
}
.changing {
  background-image: url(../../public/changing.svg);
  background-size: 5rem;
  background-position: 95% .5rem;
}
.nichijou {
  background-image: url(../../public/nichijou.svg);
  background-size: 4rem;
  background-position: 95% 2rem;
}
.special {
  background-image: url(../../public/special.svg);
  background-size: 3rem;
  background-position: 95% 4rem;
}
.what {
  background-image: url(../../public/what.svg);
  background-size: 5rem;
  background-position: 95% 2rem;
}
.recorder {
  background-image: url(../../public/recorder.svg);
  background-size: 3rem;
  background-position: 95% 1rem;
}
.feellow {
  background-image: url(../../public/feellow.svg);
  background-size: 5rem;
  background-position: 95% 0rem;
}
.right {
  button {
    width: 4rem;
    height: 2rem;
    border: none;
    outline: none;
    border-radius: 1rem;
    background-color: #ddf;
    background-image: url('../../public/send.svg');
    background-size: 1.125rem 1.125rem;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    cursor: pointer;
    transition: all .5s ease;
    &:hover {
      background-color: #aaf;
    }
  }
  input, textarea {
    padding: .5rem .75rem;
    width: calc(100% - 1.5rem);
    font-size: .8125rem;
    font-family: Verdana, Helvetica, Arial, sans-serif;
    line-height: 1.25rem;
    transition: all .2s ease;
    &:focus {
      background-color: #dcdcdc;
    }
  }
  .replyto {
    font-size: 15px;
    cursor: pointer;
    transition: color .2s ease-in-out;
    &:hover {
      color: #aaa;
    }
  }
  .templates {
    display: flex;
    flex-wrap: wrap;
    font-size: .875rem;
    line-height: 2.5rem;
    span {
      line-height: 2.5rem;
    }
    div {
      flex: 0 0 auto;
      margin: .25rem .25rem 0 0;
      padding: 0 .5rem;
      line-height: 1.5rem;
      background-color: #DEE1E6;
      border-radius: 1rem;
      cursor: pointer;
    }
  }
}
@media (max-width: 750px) {
  .twit {
    width: 100%;
    margin: 0;
    margin-bottom: 5rem;
    padding: 0;
    #add-open {
      position: fixed;
      bottom: 5rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 1.5rem;
      background-color: #ccf;
      background-image: url(../../public/send.svg);
      background-position: 45% 50%;
      background-size: 50%;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .add{
      input, textarea {
        margin-top: 1rem;
        width: calc(100% - 2rem);
        padding: 1rem;
        font-size: 1rem;
      }
      textarea {
        margin-top: 0;
      }
      .input-name {
        margin-top: 1rem;
      }
      .close {
        background-image: url(../../public/close.svg);
        background-size: 1rem;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-color: pink;
      }
      button {
        margin: 0 1rem;
        width: 5rem;
      }
    }
  }
  .hide {
    display: none;
  }
}
.slide-large-enter, .slide-large-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-small-leave-to, .slide-small-enter {
  transform: translateY(8rem);
  opacity: 0;
}
.slide-small-enter-active, .slide-small-leave-active, .slide-large-enter-active, .slide-large-leave-active {
  transition: all .3s ease-in-out;
}
</style>