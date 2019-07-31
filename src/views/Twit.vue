<template>
  <div class="twit">
    <Loading :intSwitch=intSwitch></Loading>
    <div class="main">
      <div class="item" v-for="(item, index) in data" :key="index">
        <div class='meta'>
          <div class="name">{{item.author_name}}</div>
          <div class="date">{{slicedDate(item.date)}}</div>
        </div>
        <div class="content" v-html="item.content.rendered" @click="clickbub($event)"></div>
        <div class="opmenu">
          <div class='comments' @click='toParent=item.id'>
            <div class='icon' style='width:1.25rem'><svg viewBox="0 0 24 24"><path fill='#ccc' d='M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z'></path></svg></div>
            <div class='num'>{{item.child.length === 0 ? '' : item.child.length}}</div>
            </div>
          <div class='react'>
            <div v-for='(val, key) in itemReact(item)' :key='key' class='added'>
              {{map[key]}}{{val}}
            </div>
            <div class='addreact'>+
              <div class='list'>
                <div class='addreact-item' v-for="(val, key) in map" :key="val" @click='react(item, key)'>{{val}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="child in item.child" :key='child.author' class="item item-child">
          <div class='meta'>
            <div class="name">{{child.author_name}}</div>
            <div class="date">{{slicedDate(child.date)}}</div>
          </div>
          <div class="content" v-html="child.content.rendered" @click="clickbub($event)"></div>
        </div>
      </div>
    </div>
    <transition name="slide-small" mode="out-in">
      <div id="add-open" v-show="!addOpen" @click="addOpen=true"></div>
    </transition>
    <transition name="slide-large" mode="out-in">
      <div class="add" v-show="addOpen||large_device">
        <div class="close" @click="addOpen=false"></div>
        <div class="input-name"><input type='text' v-model='name' placeholder="这里写名字还是标题？"></div>
        <div class="input-content"><textarea type='text' v-model='content' placeholder="反正这里是写内容的" rows="10"></textarea></div>
        <div class='replyto' v-show="toParent != 0" @click='toParent=0'>回复给<i>{{toParentName}}</i><br>（点击取消）</div>
        <button @click="send"></button>
      </div>
    </transition>
  </div>
</template>

<script>
import bus from '@/bus.js'
import List from '@/components/List.vue'
import Loading from '@/components/Loading.vue'
export default {
  name: 'twit',
  data () {
    return {
      intSwitch: 0,
      data: [],
      max_page: 101,
      name: '',
      content: '',
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
      }
    }
  },
  components: {
    Loading
  },
  created () {
    this.fetchComment(1)
    this.setDevice()
    window.addEventListener('resize', () => {
      this.setDevice()
    })
    window.addEventListener('scroll', this.scrollBottom)
  },
  computed: {
    toParentName: function () {
      let item = this.data.find(v => v.id === this.toParent)
      return item === undefined ? '' : item.author_name
    },
    itemReact: function () {
      return (item) => {
        let pair = this.reactdata.find(v => v.id == item.id)  // v.id is str, use ==
        return pair === undefined ? [] : pair.react
      }
    },
    slicedContent: function () {
      return function (content) {
        let plain = content.replace(/<[^>]*>/g, '')
        return plain
      }
    },
    slicedDate: function () {
      return function (d) {
        let ds = d.split(/[-T:]/)
        ds[0] = ds[0].slice(2, 4)
        ds = ds.slice(0, -1)
        ds = ds.slice(0,3).join('-') + ' ' + ds.slice(3,5).join(':')
        return ds
      }
    }
  },
  methods: {
    fetchReact () {
      fetch(window.domain + '/react.php')
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
      fetch(window.domain + '/react.php', {
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
      if (this.intSwitch == 0 && document.documentElement.scrollTop + document.documentElement.clientHeight >= document.body.clientHeight) {
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
    send () {
      if (this.content == '' || this.name == '') {
        bus.$emit('pop', '还没有填姓名或内容哦')
        return
      }
      this.intSwitch = 1
      let form = new FormData()
      form.append('author_name', this.name)
      form.append('content', this.content)
      form.append('parent', this.toParent)
      form.append('post', 53)
      form.append('author_email', '787817128@qq.com')
      fetch(window.ip + 'comments', {
        method: 'POST',
        body: form
      }).then(() => {
        this.addOpen = false
        this.clearComment()
        bus.$emit('pop', '已发送')
        this.intSwitch = 1
        this.fetchComment(1)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.twit {
  position: relative;
  margin-left: 30%;
  padding-right: 30%;
  width: 40%;
  .main {
    padding: 2rem 0rem;
    border-right: 1px solid #eee;
    text-align: left;
    .item {
      padding: 1rem 2rem;
      border-top: 1px solid #eee;
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
        height: 1.25rem;
        line-height: 1.25rem;
        color: #888;
        font-size: 15px;
        user-select: none;
        .comments {
          display: inline-block;
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
        .react {
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin-left: 2rem;
          .added {
            display: inline-block;
            margin-right: 1rem;
          }
          .addreact {
            position: absolute;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
            z-index: 1;
            &:hover .list {
              display: flex;
            }
            .list {
              display: none;
              flex-wrap: wrap;
              padding: .5rem;
              width: 8rem;
              background-color: white;
              border: 1px solid #ddd;
              border-radius: .5rem;
              cursor: pointer;
              .addreact-item {
                flex: 0 0 auto;
                width: 2rem;
                height: 2rem;
                line-height: 2rem;
                text-align: center;
              }
            }
          }
        }
      }
    }
    .item-child {
      margin-top: 1rem;
      padding-bottom: 0;
    }
  }
  .add {
    position: fixed;
    top: 0;
    left: 70%;
    padding: 2rem 2rem;
    max-width: 15rem;
    width: calc(100% - 1.5rem);
    button {
      width: 3.5rem;
      height: 2rem;
      border: none;
      outline: none;
      border-radius: 1rem;
      background-color: #ddf;
      background-image: url('../../public/send.png');
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
      margin-bottom: 1rem;
      padding: .5rem .75rem;
      width: calc(100% - 1.5rem);
      border: 1px solid #eee;
      border-radius: 1rem;
      letter-spacing: 1px;
      font-size: .8125rem;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      transition: all .2s ease;
      &:hover, &:focus {
        border-color: #88f;
      }
    }
    .replyto {
      margin-bottom: 1rem;
      font-size: 15px;
      cursor: pointer;
      transition: color .2s ease-in-out;
      &:hover {
        color: #aaa;
      }
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
      background-image: url(../../public/send.png);
      background-position: 45% 50%;
      background-size: 50%;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .add{
      position: fixed;
      top: 0;
      left: 0;
      padding: 0;
      max-width: 100%;
      width: 100%;
      height: 100%;
      background-color: #fff;
      z-index: 1;
      input, textarea {
        margin: 0 4rem;
        padding: 1rem;
        width: calc(100% - 10rem);
        max-width: 100%;
        font-size: 1rem;
        border: none;
        border-radius: 0;
      }
      .input-name {
        margin-top: 6rem;
        text-align: left;
        input {
          padding: 1rem;
          width: 10rem;
        }
      }
      textarea {
        border-top: 1px solid #ccf;
      }
      button {
        position: absolute;
        top: calc(3.5rem + 1px);
        right: 2rem;
      }
      .close {
        position: absolute;
        left: 2rem;
        top: calc(3.5rem + 1px);
        width: 2rem;
        height: 2rem;
        background-image: url(../../public/close.png);
        background-size: 60% 60%;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        cursor: pointer;
      }
      .replyto {
        margin-bottom: 1rem;
        font-size: 14px;
        cursor: pointer;
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