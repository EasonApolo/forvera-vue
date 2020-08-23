<template>
  <div class="home">
    <layout>
      <template #main>
        <list :loading='locked'>
          <template #list>
            <div class="item" v-for="(item, index) in contents" :key="item.id" :data-index="index" @click="toArt(item.id)">
              <div class="title">
                <span>{{item.title.rendered}}</span>
                <span class="time">{{slicedDate(item.date)}}</span>
              </div>
              <div class="content">
                {{slicedContent(item.content.rendered)}}
              </div>
            </div>
          </template>
        </list>
        <div class="nav">
          <span @click="setPage(page-1)" class="pre" :class="{disable:isPage(page-1)}">上一页</span>
          <span v-for="n in shownPages" :key="n" :class="{active:n==page}" @click="setPage(n)" class="nav-digit">{{ n }}</span>
          <span @click="setPage(page+1)" class="post" :class="{disable:isPage(page+1)}">下一页</span>
        </div>
      </template>
      <template #right>
        <rbox title='分类'>
          <template #list>
            <div class='item' v-for="c in category" :key="c.id" @click="setCat(c)" :class="{disabled:locked,active:(c.id===cat)}">
              {{c.name}} ({{c.count}})
            </div>
          </template>
        </rbox>
        <rbox title='标签'>
          <template #list>
            <div class='item' v-for="t in tags" :key="t.id" @click="setTag(t)" :class="{active:(t.id===tag),disabled:locked}" v-show="t.description == cat">
              {{t.name}} ({{t.count}})
            </div>
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
export default {
  name: 'home',
  data () {
    return {
      //
      contents: [],
      // category
      cat: 0,
      category: [],
      mappedCatIDs: [4, 5, 7],
      originCatIDs: [7, 8, 9],
      // tag
      tags: [],
      tag: undefined,
      // nav
      total_count: 0,
      page: 1,
      page_count: 1,
      per_page: 5,
      // lock
      locked: false,
    }
  },
  components: {
    'list': List,
    'layout': Layout,
    'rbox': Rbox,
  },
  created () {
    this.fetchCategory()
    this.fetchTag()
  },
  computed: {
    isPage: function () {
      return function (page_id) {
        return page_id < 1 || page_id > this.page_count
      }
    },
    shownPages: function () {
      let shown = []
      for (let i = 1; i <= this.page_count; i++) {
        if (Math.abs(i-this.page)<=3) shown.push(i)
      }
      return shown
    },
    slicedContent: function () {
      return function (content) {
        let plain = content.replace(/<[^>]*>/g, '')
        return plain.length > 147 ? plain.substring(0, 147) + '...' : plain
      }
    },
    catAndPage: function () {
      return [this.cat, this.page, this.tag].join()
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
    fetchCategory: function () {
      fetch(window.ip + 'categories')
      .then(res => {
        return res.json()
      })
      .then(json => {
        let activeCats = []
        for (let i in this.mappedCatIDs) {
          for (let j in json) {
            if (json[j].id == this.mappedCatIDs[i]) {
              activeCats.push(json[j])
              // if (i == 0) {
              //   this.setCat(json[j])
              // }
            }
          }
        }
        this.category = activeCats
        this.total_count = this.category.reduce((acc,cur)=>acc+cur.count,0)
        this.setCat({ id: -1 })
      })
    },
    fetchTag: function () {
      fetch(window.ip + 'tags')
      .then(res => {
        return res.json()
      })
      .then(json => {
        for (let i in json) {
          let originCatID = parseInt(json[i].description)
          let mappedCatID = this.mappedCatIDs[this.originCatIDs.indexOf(originCatID)]
          json[i].description = mappedCatID
        }
        this.tags = json
      })
    },
    fetchData: function () {
      this.intSwitch = 1
      let query = `${window.ip}posts?page=${this.page}&per_page=${this.per_page}${this.cat==-1?'':'&categories='+this.cat}${this.tag==undefined?'':'&tags='+this.tag}`
      fetch(query).then(res => res.json()).then(json => {
        this.contents = json
        this.locked = false
      })
    },
    setTag: function (tag) {
      if (this.locked) return
      else this.locked = true
      // cancel
      if (this.tag == tag.id) {
        this.tag = undefined
        for (let i in this.category) {
          if (this.category[i].id == this.cat) {
            this.page_count = Math.ceil(this.category[i].count / this.per_page)
          }
        }
      } else {
        this.tag = tag.id
        this.page_count = Math.ceil(tag.count / this.per_page)
      }
      this.page = 1
      this.fetchData()
    },
    setCat: function (cat) {
      if (this.locked) return
      this.lock()
      if (cat.id == this.cat) cat = { id: -1 }
      this.cat = cat.id
      this.tag = undefined
      this.page = 1
      let cat_count = cat.id == -1 ? this.total_count : cat.count
      this.page_count = Math.ceil(cat_count / this.per_page)
      this.fetchData()
    },
    setPage: function (page_id) {
      if (this.locked) return
      this.lock()
      if (page_id < 1 || page_id > this.page_count) {
        this.$bus.$emit('pop', '没有更多啦')
        this.unlock()
        return
      }
      this.page = page_id
      this.fetchData()
    },
    unlock: function () {
      this.locked = false
    },
    lock: function () {
      this.locked = true
    }
  }
}
</script>

<style scoped lang="scss">
.nav {
  margin: 2rem auto;
  width: 45%;
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
  .active {
    color: #aaa;
  }
  .nav-digit {
    margin: 0 .5rem;
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
  }
}
@media (max-width: 1000px) {
  .nav {
    width: 85%;
  }
}
@media (min-width: 1000px) and (max-width: 1300px) {
  .nav {
    width: 65%;
  }
}
</style>