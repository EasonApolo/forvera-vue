<template>
  <div id="app">
    <div id="nav">
      <ul id="nav-content">
        <router-link class="a-index" to="/"     >{{titleHome}}</router-link>
        <router-link class="a-board" to="/twit" >{{titleTwit}}</router-link>
        <router-link class="a-tool"  to="/tool" >{{titleTool}}</router-link>
        <router-link class="a-about" to="/about">{{titleAbout}}</router-link>
      </ul>
    </div>
      <keep-alive include="home,twit,tool,about">
        <router-view/>
      </keep-alive>
    <!-- <transition :name="transitionName" mode="out-in">
    </transition> -->
    <pop></pop>
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
  min-height: 100vh;
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
.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active, .slide-up-enter-active, .slide-up-leave-active, .slide-down-enter-active, .slide-down-leave-active {
  transition: all .2s ease;
}
.slide-left-enter, .slide-right-leave-to {
  transform: translateX(10%);
  opacity: 0;
}
.slide-left-leave-to, .slide-right-enter {
  transform: translateX(-10%);
  opacity: 0;
}
.slide-up-enter, .slide-down-leave-to {
  transform: translateY(30%);
  opacity: 0;
}
.slide-up-leave-to, .slide-down-enter {
  transform: translateY(-30%);
  opacity: 0;
}
@media (min-width: 750px) {
  #nav {
    position: fixed;
    left: calc(30% - 13rem);
    padding: 0 0;
    width: calc(15rem - 2rem);
    height: 100%;
    border-right: 1px solid #eee;
    z-index: 1;
  }
  #nav-content {
    margin-top: 3rem;
    a {
      margin: 0 2rem 1rem 2rem;
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
  #nav {
    position: fixed;
    padding-bottom: 1rem;
    bottom: 0;
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