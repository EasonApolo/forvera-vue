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
      <span v-for="n in shownPages" :key="n" :class="{active:n==page}" @click="setPage(n)" class="nav-digit">{{ n }}</span>
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
      total_count: 0,
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
    },
    shownPages: function () {
      let shown = []
      for (let i = 1; i <= this.page_count; i++) {
        if (Math.abs(i-this.page)<=3) shown.push(i)
      }
      return shown
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
    setCat: function (cat) {
      if (this.locked) return
      this.lock()
      if (cat.id == this.cat) cat = { id: -1 }
      this.cat = cat.id
      this.tag = undefined
      this.page = 1
      let cat_count = cat.id == -1 ? this.total_count : cat.count
      this.page_count = Math.ceil(cat_count / this.per_page)
      this.lock()
    },
    setPage: function (page_id) {
      if (this.locked) return
      this.lock()
      if (page_id < 1 || page_id > this.page_count) {
        bus.$emit('pop', '没有更多啦')
        this.unlock()
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
  margin: 0 auto;
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
    }
    div {
      padding: .5rem 0;
      font-size: 1rem;
    }
    .disabled {
      color: #888;
    }
    .active {
      background-color: #f1f1ff;
    }
  }
  .tags {
    width: 11rem;
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
@media (min-width: 750px) {
  .nav .pre:hover {
    transform: translateX(-.5rem);
  }
  .nav .post:hover {
    transform: translateX(.5rem);
  }
  .right .rbox li:hover {
    background-color: #eeeeff;
  }
}
@media (max-width: 750px) {
  .home {
    margin: 0 0 8rem 0;
    padding-right: 0;
    width: 100%;
    border-right: none;
  }
  .right {
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    left: 0;
    right: 0;
    bottom: calc(4rem + 2rem);
    padding: 0;
    background-color: #fff;
    border-top: 1px solid #eee;
    line-height: 2.5rem;
    z-index: 1;
    .rbox {
      width: 100%;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      div, li {
        display: inline-block;
        margin: 0;
        padding: 0;
        vertical-align: top;
        text-align: center;
        font-size: .875rem;
      }
      div {
        width: 5rem;
        color: transparent;
        background-image: url(../../public/category.svg);
        background-size: 1.5rem;
        background-repeat: no-repeat;
        background-position: 50% 50%;
      }
      li {
        $h: 1.8rem;
        margin: (2.5rem - $h)/2 .25rem;
        padding: 0 .625rem;
        height: $h;
        line-height: $h;
        border-radius: 1rem;
        color: #555;
        background-color: #ddd;
        white-space: nowrap;
        &.active {
          color: white;
          background-color: #5C5FEA;
        }
      }
      div {
        position: relative;
        flex: 1 1 auto;
      }
    }
    .tags {
      div { display: none; }
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .nav {
    position: fixed;
    margin: 0;
    padding: 0 2rem;
    left: 0;
    right: 0;
    bottom: calc(4rem + 1px);
    background-color: white;
    .active {
      border-bottom: 3px solid #f1f1ff !important;
      background-color: white !important;
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