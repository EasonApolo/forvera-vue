<template>
  <div id="app">
    <div id="nav">
      <ul id="nav-content">
        <router-link class="a-index" to="/">首页</router-link>
        <router-link class="a-board" to="/twit">留言</router-link>
        <router-link class="a-about" to="/about">关于</router-link>
      </ul>
    </div>
    <transition :name="transitionName" mode="out-in">
      <keep-alive include="home">
        <router-view/>
      </keep-alive>
    </transition>
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
  watch: {
    '$route' (to, from) {
      const routelist = ['home', 'about']
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
    left: calc(30% - 15rem);
    width: 15rem;
    height: 100%;
    z-index: 1;
  }
  #nav-content {
    margin-top: 3rem;
    a {
      display: block;
      padding: 0.75rem 0;
      transition: .3s;
      user-select: none;
      border-radius: .75rem;
      &.router-link-exact-active {
        background-color: #f5f5ff
      }
      &:hover {
        background-color: #eeeeff
      }
    }
  }
}
@media (max-width: 750px) {
  #nav {
    position: fixed;
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
        color: transparent;
      }
      .a-index, .a-board, .a-about {
        background-size: 1.4325rem;
        background-position: 50%;
        background-repeat: no-repeat;
      }
      .a-index {
        background-image: url(../public/index.png);
      }
      .a-index.router-link-exact-active {
        background-image: url(../public/index_active.png);
      }
      .a-board {
        background-size: 1.375rem;
        background-image: url(../public/board.png);
      }
      .a-board.router-link-exact-active {
        background-image: url(../public/board_active.png);
      }
      .a-about {
        background-size: 1.125rem;
        background-image: url(../public/about.png);
      }
      .a-about.router-link-exact-active {
        background-image: url(../public/about_active.png);
      }
    }
  }
}
</style>