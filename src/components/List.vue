<template>
  <div class="list">
    <Loading :intSwitch=intSwitch></Loading>
    <transition-group name="list-complete" tag="div">
      <div class="item" v-for="(item, index) in items" :key="item.id" :data-index="index">
        <div class="title">
          <a @click="toArt(item.id)">{{item.title.rendered}}</a>
          <span class="time">{{slicedDate(item.date)}}</span>
        </div>
        <div class="content">
          {{slicedContent(item.content.rendered)}}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import bus from '@/bus.js'
import Loading from '@/components/Loading.vue'
export default {
  name: 'List',
  props: {cat: {}, per_page: {}, page: {default: 1}},
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
  },
  computed: {
    slicedContent: function () {
      return function (content) {
        let plain = content.replace(/<[^>]*>/g, '')
        return plain.length > 147 ? plain.substring(0, 147) + '...' : plain
      }
    },
    catAndPage: function () {
      return [this.cat, this.page].join()
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
    toArt: function (id) {
      this.$router.push({path: 'art', query: {id: id}})
    },
    fetchData: function () {
      this.intSwitch = 1
      fetch(window.ip + 'posts' + '?categories=' + this.cat + '&page=' + this.page + '&per_page=' + this.per_page)
      .then(res => {
        return res.json()
      }).then(json => {
        this.intSwitch = 0
        let id = setInterval(() => {
          this.items.pop()
          if (this.items.length <= 0) {
            clearInterval(id)
            let id2 = setInterval(() => {
              this.items.push(json.shift())
              if (json.length <= 0) {
                clearInterval(id2)
              }
            }, 100)
          }
        }, 100)
      })
    }
  },
  watch: {
    'catAndPage': {
      handler: function (val) {
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
.list-complete-move {
  transition: all .1s;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(-.5rem);
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
  width: calc(100% - 4rem);
  left: 0;
  padding: 2rem 2rem .5rem 2rem;
  text-align: left;
  transition: all .3s;
  .title {
    font-size: 1rem;
    line-height: 1.5rem;
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
    line-height: 1.375rem;
    color: #555;
  }
}
</style>