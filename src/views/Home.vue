<template>
  <div class="home">
    <div class='right'>
      <ul class="rbox category">
        <div>分类</div>
        <li v-for="c in category" :key="c.id" @click="setCat(c)" :class="{disabled:locked,active:(c.id===cat)}">
          {{c.name}} ({{c.count}})
        </li>
      </ul>
      <ul class="rbox tags">
        <div>标签</div>
        <li v-for="t in tags" :key="t.id" @click="setTag(t)" :class="{active:(t.id===tag),disabled:locked}" v-show="t.description == cat">
          {{t.name}} ({{t.count}})
        </li>
      </ul>
    </div>
    <div class="list-wrapper">
      <List :cat="cat" :page="page" :per_page="per_page" :tag='tag' @loadOK='unlock()' />
    </div>
    <div class="nav">
      <span @click="setPage(page-1)" class="pre" :class="{disable:isPage(page-1)}">上一页</span>
      <span v-for="n in page_count" :key="n" :class="{active:n==page}" @click="setPage(n)" class="nav-digit">{{ n }}</span>
      <span @click="setPage(page+1)" class="post" :class="{disable:isPage(page+1)}">下一页</span>
    </div>
  </div>
</template>

<script>
import bus from '@/bus.js'
import List from '@/components/List.vue'
export default {
  name: 'home',
  data () {
    return {
      category: [],
      cat: 0,
      tags: [],
      mappedCatIDs: [4, 5, 7],
      originCatIDs: [7, 8, 9],
      tag: undefined,
      page: 1,
      page_count: 1,
      per_page: 5,
      locked: false,
    }
  },
  components: {
    List
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
    }
  },
  methods: {
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
              if (i == 0) {
                this.setCat(json[j])
              }
            }
          }
        }
        this.category = activeCats
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
    setCat: function (cat) {
      if (this.locked) return
      this.lock()
      this.cat = cat.id
      if (this.tag != undefined) {
        for (let i in this.tags) {
          if (this.tags[i].id == this.tag) {
            if (!this.tags[i].description == cat) {
              this.tag = undefined
            }
          }
        }
      }
      this.page = 1
      this.page_count = Math.ceil(cat.count / this.per_page)
      this.lock()
    },
    setPage: function (page_id) {
      if (this.locked) return
      this.lock()
      if (page_id < 1 || page_id > this.page_count) {
        bus.$emit('pop', '没有更多啦')
        return
      }
      this.page = page_id
      this.lock()
    },
    setTag: function (tag) {
      if (this.locked) return
      this.lock()
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
.home {
  position: relative;
  margin: 0 30%;
  padding-bottom: 3rem;
  width: 40%;
  min-height: 100vh;
  border-right: 1px solid #eee;
}
.right {
  position: fixed;
  left: calc(70% + 2rem);
  padding-top: 3rem;
  .rbox {
    width: 9rem;
    border-radius: .75rem;
    font-size: .875rem;
    text-align: left;
    li {
      margin: .25rem 0;
      padding: .5rem 1rem;
      border-radius: 2rem;
      transition: .2s;
      user-select: none;
      cursor: pointer;
      transition: color .2s ease-in-out;
      &:hover {
        background-color: #eeeeff;
      }
    }
    div {
      padding: .5rem 0;
      font-size: 1rem;
    }
    .disabled {
      color: #888;
    }
    .active {
      background-color: #f1f1ff
    }
  }
  .tags {
    width: 11rem;
  }
}
@media (max-width: 750px) {
  .home {
    margin: 0 0 3rem 0;
    padding-right: 0;
    width: 100%;
    border-right: none;
  }
  .right {
    position: relative;
    left: 0;
    right: 0;
    padding: 0;
    width: 100%;
    .rbox {
      display: flex;
      width: 100%;
      div, li {
        display: inline-block;
        flex: 0 0 auto;
        margin: 0;
        padding: 0;
        height: 2rem;
        line-height: 2rem;
        vertical-align: top;
        text-align: center;
        font-size: .875rem;
      }
      li {
        width: 25%;
        border-radius: 0;
        border-bottom: 3px solid white;
        &:hover {
          background-color: white;
        }
      }
      div {
        position: relative;
        flex: 1 1 auto;
      }
    }
    .tags {
      display: none;
    }
  }
  .active {
    border-bottom: 3px solid #f1f1ff !important;
    background-color: white !important;
  }
}
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