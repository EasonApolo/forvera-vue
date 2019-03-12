<template>
  <div class="twit">
    <Loading :intSwitch=intSwitch></Loading>
    <div class="content">
      <div class="item" v-for="(item, index) in data" :key="index">
        <div>
          <div class="item-name">{{item.author_name}}</div>
          <div class="item-date">{{slicedDate(item.date_gmt)}}</div>
        </div>
        <div class="bub" v-html="item.content.rendered" @click="clickbub($event)">
        </div>
      </div>
    </div>
    <transition name="slide-small" mode="out-in">
      <div id="add-open" v-show="!addOpen" @click="addOpen=true"></div>
    </transition>
    <transition name="slide-large" mode="out-in">
      <div class="add" v-show="addOpen||large_device">
        <div class="close" @click="addOpen=false"></div>
        <div class="input-name"><input type='text' v-model='name' placeholder="精灵咏唱者">
        </div>
        <div class="input-content"><textarea type='text' v-model='content' placeholder="曾经，有一个来自吉尔尼斯的人…" rows="10"></textarea></div>
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
      name: '',
      content: '',
      addOpen: false,
      large_device: true
    }
  },
  components: {
    Loading
  },
  created () {
    this.fetchComment()
    this.setDevice()
    window.addEventListener('resize', () => {
      this.setDevice()
    })
  },
  computed: {
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
    clickbub (e) {
      console.log(e)
      if (e.target.nodeName === 'IMG') {
        if (e.target.style.maxWidth === '100%') {
          e.target.style.maxWidth = '30%'
        } else {
          e.target.style.maxWidth = '100%'
        }
        console.log(e.target.style.maxWidth)
      }
    },
    setDevice () {
      this.large_device = document.documentElement.clientWidth > 750 
    },
    fetchComment () {
      this.data = []
      this.intSwitch = 1
      fetch(window.ip + 'comments?post=' + 53)
      .then(res => {
        return res.json()
      }).then(json => {
        this.data = json
        this.intSwitch = 0
      })
    },
    send () {
      if (this.content == '' || this.name == '') {
        bus.$emit('pop', '还没有填姓名或内容哦')
        return
      }
      let form = new FormData()
      form.append('author_name', this.name)
      form.append('content', this.content)
      form.append('parent', 0)
      form.append('post', 53)
      form.append('author_email', '787817128@qq.com')
      fetch(window.ip + 'comments', {
        method: 'POST',
        body: form
      }).then(() => {
        this.addOpen = false
        this.fetchComment()
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
  .content {
    padding: 2rem 2rem;
    text-align: left;
    .item {
      margin: 0 0 1rem 0;
      .item-name, .item-date {
        display: inline-block;
        margin: 0 1rem .75rem 0;
        color: #999;
        font-size: .9375rem;
      }
      .item-date {
        font-size: .8125rem;
      }
      .bub {
        display: inline-block;
        position: relative;
        padding: .5rem 1.25rem;
        background-color: #f2f2ff;
        border-radius: 1.25rem;
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
        &:after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          left: 1rem;
          top: -8px;
          border-width: 0 12px 8px 0;
          border-style: solid;
          border-color: #f2f2ff;
          border-bottom-color: transparent;
          border-top-right-radius: 16px;
        }
      }
    }
  }
  .add {
    position: absolute;
    top: 0;
    left: 57.1%;
    width: 30%;
    padding: 2rem 0;
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
      width: calc(100% - 1.5rem);
      max-width: 15rem;
      padding: .5rem .75rem;
      border: 1px solid #ccf;
      transition: all .2s ease;
      font-size: .8125rem;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      border-radius: 1rem;
      &:hover, &:focus {
        border-color: #88f;
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
      padding: 0;
      position: fixed;
      top: 0;
      left: 0;
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