<template>
  <div class="list">
    <div v-for="item in items" :key="item.id" class="item">
      <div class="title">
        <a @click="toArt(item.id)">{{item.title.rendered}}</a>
        <span class="time">{{item.date}}</span>
      </div>
      <div class="content">
        {{slicedContent(item.content.rendered)}}
      </div>
    </div>
    <div class="nav">
      <!-- <span @click="toPrePage" class="pre" :class="{disable:getPre}">上一页</span>
      <span @click="toPostPage" class="post" :class="{disable:getPost}">下一页</span> -->
    </div>
  </div>
</template>

<script>
import bus from '@/bus.js'
export default {
  name: 'List',
  props: ['cat', 'per_page', 'page'],
  data () {
    return {
      items: [],
      nav: []
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    slicedContent: function () {
      return function (content) {
        let plain = content.replace(/<[^>]*>/g, '')
        return plain.length > 147 ? plain.substring(0, 147) + '...' : plain
      }
    }
    // getPre: function () {
    //   return !this.nav['pre']
    // },
    // getPost: function () {
    //   return !this.nav['post']
    // }
  },
  methods: {
    toArt: function (id) {
      this.$router.push({path: 'art', query: {id: id}})
    },
    fetchData: function () {
      fetch(window.ip + 'posts' + '?categories=' + this.cat + '&page=' + this.page + '&per_page=' + this.per_page)
      .then(res => {
        return res.json()
      }).then(json => {
        this.items = json
      })
    },
    toPostPage: function () {
      if (this.nav['post']) {
        this.page++
      } else {
        bus.$emit('pop', '已经是最后一页>_<')
      }
    },
    // toPrePage: function () {
    //   if (this.nav['pre']) {
    //     this.page--
    //   } else {
    //     bus.$emit('pop', '已经是第一页>_<')
    //   }
    // }
  },
  watch: {
    'cat': {
      handler: function () {
        this.fetchData()
      },
      immediate: false,
    },
    'page': {
      handler: function () {
        this.fetchData()
      },
      immediate: false,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item {
  padding: 2rem 2rem;
  text-align: left;
  .title {
    font-size: 1rem;
    transition: color .2s;
    .time {
      margin-left: 1rem;
      line-height: 1rem;
      font-size: 0.875rem;
      color: #888;
    }
    a:hover{
      cursor: pointer;
    }
  }
  .content {
    margin-top: 0.25rem;
    font-size: 0.875rem;
  }
}
.nav {
  margin: 0 auto;
  width: 38.2%;
  height: 2rem;
  font-size: .875rem;
  span {
    position: relative;
    height: 100%;
    line-height: 2rem;
    transition: .3s ease;
    cursor: pointer;
    user-select: none;
  }
  .disable {
    opacity: .4;
  }
  .pre {
    float: left;
    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: .5rem;
      height: 1rem;
      width: 1rem;
      background-image: url(../../public/left.png);
      background-size: contain;
    }
    &:hover {
      transform: translateX(-.5rem);
    }
  }
  .post {
    float: right;
    &::before {
      content: '';
      position: absolute;
      right: -1rem;
      top: .5rem;
      height: 1rem;
      width: 1rem;
      background-image: url(../../public/right.png);
      background-size: contain;
    }
    &:hover {
      transform: translateX(.5rem);
    }
  }
}
@media (max-width: 750px) {
  .nav {
    .pre, .post {
      &:hover {
        transform: translateX(0);
      }
    }
  }
}
</style>