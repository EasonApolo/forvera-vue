<template>
  <div id="app">
    <keep-alive include="home,twit,tool,about">
      <router-view/>
    </keep-alive>
    <pop></pop>
    <div id="nav">
      <ul id="nav-content">
        <router-link class="a-index" to="/"     >{{titleHome}}</router-link>
        <router-link class="a-board" to="/twit" >{{titleTwit}}</router-link>
        <router-link class="a-tool"  to="/tool" >{{titleTool}}</router-link>
        <router-link class="a-about" to="/about">{{titleAbout}}</router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import Pop from '@/components/Pop'
export default {
  data () {
    return {
      transitionName: ''
    }
  },
  components: {
    Pop
  },
  computed: {
    titleHome () {
      return document.body.clientWidth < 750 ? 'Y' : '文章'
    },
    titleTwit () {
      return document.body.clientWidth < 750 ? 'Y' : '留言'
    },
    titleTool () {
      return document.body.clientWidth < 750 ? 'D' : '工具'
    },
    titleAbout () {
      return document.body.clientWidth < 750 ? 'T' : '关于'
    },
  },
  watch: {
    '$route' (to, from) {
      const routelist = ['home', 'twit', 'tool', 'about']
      if (to.name === 'art') {
        this.transitionName = 'slide-left'
      } else if (from.name === 'art') {
        this.transitionName = 'slide-right'
      } else if (routelist.indexOf(from.name) > routelist.indexOf(to.name)){
        this.transitionName = 'slide-down'
      } else {
        this.transitionName = 'slide-up'
      }
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
html {
  overflow-y: scroll;
}
body {
  margin: 0;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
div, a, button, span, li {
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
input, textarea {
  border: none;
  background-color: transparent;
  outline: none;
  border-radius: 0;
  -webkit-appearance: none;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
a {
  color: #2c3e50;
  text-decoration: none;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
#app {
  position: relative;
  margin: 0 auto;
  max-width: 1000px;
  height: 100%;
  text-align: center;
  color: #2c3e50;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/*这个好像必须要有，height可以没有*/
::-webkit-scrollbar {
  width: 10px;
}
/*滚动条背景*/
::-webkit-scrollbar-track-piece {
  background-color: #fff; 
  border-radius: 0;
}
/*垂直滚动条的样式*/
::-webkit-scrollbar-thumb:vertical { 
    background-color: #ccc;
    border-radius: 16px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
}
@media (min-width: 750px) {
  #nav {
    position: absolute;
    padding: 3rem 2rem 0 0;
    top: 0;
    left: 0;
    height: calc(100% - 3rem);
    border-right: 1px solid #eee;
    z-index: 1;
  }
  #nav-content {
    width: 9rem;
    a {
      margin-bottom: 1rem;
      display: block;
      padding: 0.5rem 0;
      border-radius: 3rem;
      transition: .2s;
      letter-spacing: 2px;
      user-select: none;
      &.router-link-exact-active {
        background-color: #f1f1ff;
      }
      &:hover {
        background-color: #e5e5ff
      }
    }
  }
}
@media (max-width: 750px) {
  #app {
    display: flex;
    flex-direction: column;
  }
  #nav {
    position: relative;
    padding-bottom: 1rem;
    width: 100%;
    height: 3rem;
    background-color: #fff;
    border-top: 1px solid #eee;
    z-index: 1;
    #nav-content {
      display: flex;
      a {
        flex: 1 1 auto;
        height: 100%;
        line-height: 3rem;
        display: inline-block;
        transition: .3s;
        border-radius: 1rem;
        font-family: 'Courier';
      }
      a.router-link-exact-active {
        font-weight: bold;
      }
    }
  }
}
</style>