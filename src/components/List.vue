<template>
  <div class="list">
    <Loading :intSwitch=intSwitch></Loading>
    <div v-for="item in items" :key="item.id" class="item">
      <div class="title">
        <a @click="toArt(item.id)">{{item.title.rendered}}</a>
        <span class="time">{{item.date}}</span>
      </div>
      <div class="content">
        {{slicedContent(item.content.rendered)}}
      </div>
    </div>
  </div>
</template>

<script>
import bus from '@/bus.js'
import Loading from '@/components/Loading.vue'
export default {
  name: 'List',
  props: ['cat', 'per_page', 'page'],
  data () {
    return {
      items: [],
      intSwitch: 0
    }
  },
  components: {
    Loading
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
  },
  methods: {
    toArt: function (id) {
      this.$router.push({path: 'art', query: {id: id}})
    },
    fetchData: function () {
      this.intSwitch = 1
      this.items = []
      fetch(window.ip + 'posts' + '?categories=' + this.cat + '&page=' + this.page + '&per_page=' + this.per_page)
      .then(res => {
        return res.json()
      }).then(json => {
        this.items = json
        this.intSwitch = 0
      })
    }
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
.list {
  padding-top: 1rem;
  position: relative;
}
.loading-wrapper {
  position: absolute;
  width: 100%;
  .loading {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0 auto;
    background-image: url(../../public/load.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}
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
</style>