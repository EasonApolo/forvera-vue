<template>
  <div class="home">
    <ul class="category">
      <div>分类</div>
      <li v-for="c in category" :key="c.id" @click="setCat(c)" :class="{active:(c.id===cat)}">
        {{c.name}}({{c.count}})
      </li>
    </ul>
    <List :cat="cat" :page="page" :per_page="per_page"/>
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
      page: 1,
      page_count: 1,
      per_page: 10
    }
  },
  components: {
    List
  },
  created () {
    this.fetchCategory()
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
        for (let i = json.length - 1; i >= 0; i--) {
          if (json[i].id <= 6) {
            json.splice(i, 1)
          }
          else if (json[i].id == 7) {
            this.setCat(json[i])
          }
        }
        this.category = json
      })
    },
    setCat: function (cat) {
      this.cat = cat.id
      this.page = 1
      this.page_count = Math.ceil(cat.count / this.per_page)
    },
    setPage: function (page_id) {
      if (page_id < 1 || page_id > this.page_count) {
        bus.$emit('pop', '没有更多啦')
        return
      }
      this.page = page_id
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  position: relative;
  margin-left: 15rem;
  padding-right: 15rem;
  padding-bottom: 3rem;
}
.category {
  position: absolute;
  top: 0;
  right: 0;
  width: 15rem;
  padding-top: 2rem;
  font-size: .875rem;
  text-align: left;
  li {
    padding: .5rem .75rem;
    transition: .2s;
    user-select: none;
    cursor: pointer;
    &:hover {
      background-color: #ddd;
    }
  }
  div {
    padding: .5rem 0;
    font-size: 1rem;
    border-bottom: 1px solid #ccc;
  }
  .active {
    background-color: #ccc;
  }
}
@media (max-width: 750px) {
  .home {
    margin: 0 0 3rem 0;
    padding-right: 0;
  }
  .category {
    position: relative;
    display: flex;
    padding: 0;
    width: 100%;
    div, li {
      display: inline-block;
      flex: 1 1 auto;
      height: 1rem;
      border: 0;
      vertical-align: top;
      line-height: 1rem;
      text-align: center;
      font-size: .875rem;
    }
    li:hover {
      background: #ccc;
    }
    div {
      position: relative;
      padding: .5rem .75rem;
      background: linear-gradient(to right, white, #ddd);
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        top: 0;
        right: -1rem;
        border-left: 1rem solid #ddd;
        border-top: 1rem solid transparent;
        border-bottom: 1rem solid transparent;
      }
    }
  }
}
.nav {
  margin: 0 auto;
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