<template>
  <div class="about">
    <div class='item item-left'>
      <div class='head'>哟，艾博，拉面一狗贼！</div>
    </div>
    <div class='item item-left'>
      <div class='head'>Todo List</div>
      <div class='li'>1. 文章页把提纲列在右边</div>
      <div class='li'>2. 还是想把github issue用上来写todo</div>
    </div>
    <div class='item'>
      <div id="chart" class="block">
        <div class="block-header">统计</div>
        <Loading :intSwitch=intSwitch></Loading>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">  
          <defs>
            <linearGradient id="orange_red" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" style="stop-color:rgb(225, 225, 255);
              stop-opacity:1"/>
              <stop offset="100%" style="stop-color:rgb(100,100,255);
              stop-opacity:1"/>
            </linearGradient>
          </defs>
          <polyline :points=points
          style="fill:transparent;stroke:url(#orange_red);stroke-width:2"/>
        </svg>
        <div class="years"><span v-for="year in years" :key="year" class="year">{{year}}</span></div>
      </div>
    </div>
    <div class="right">
      <div class='title'>Contacts</div>
      <a href="https://github.com/EasonApolo" class="github"><span></span><div>GitHub</div></a>
      <a href="mailto:waterlilyapolo@gmail.com" class="gmail"><span></span><div>Gmail</div></a>
    </div>
  </div>
</template>

<script>
import bus from '@/bus.js'
import Loading from '@/components/Loading.vue'
export default {
  name: 'about',
  data () {
    return {
      intSwitch: 0,
      points: '',
      posts: [],
      years: []
    }
  },
  components: {
    Loading
  },
  created () {
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  methods: {
    fetchData () {
      this.intSwitch = 1
      fetch(window.ip + 'posts?per_page=' + 100)
      .then(res => {
        return res.json()
      }).then(json => {
        this.posts = json
        this.intSwitch = 0
        this.process()
      })
    },
    process () {
      let svgWidth = document.getElementById('chart').offsetWidth - 3 * 2 * 16
      let startYear = 2016
      let endYear = 2020
      let month = []
      for(let i = this.posts.length - 1; i >= 0; i--) {
        let date = this.posts[i].date.slice(0, 7).split('-')
        if (i === this.posts.length - 1) startYear = parseInt(date[0])
        if (i === 0) endYear = parseInt(date[0]) + 1
        month.push((parseInt(date[0])-startYear)*12+parseInt(date[1]))
      }
      for (let i = startYear; i <= endYear; i++) {
        this.years.push(i)
      }
      let y = Array((endYear-startYear)*12).fill(0)
      for(let i in month) {
        y[month[i] - 1] += 1
      }
      y = y.map(v => 100 - v * 10)
      let x = Array(y.length).fill(0).map((v, ind) => ind * svgWidth / (y.length-1))
      for (let i in y) {
        this.points += x[i] + ',' + y[i] + ' '
      }
    }
  }
}
</script>

<style scoped lang="scss">
.about {
  position: relative;
  margin: 0 30%;
  padding: 3rem 0;
  height: 100%;
  box-sizing: content-box;
  border-right: 1px solid #eee;
  .item {
    padding: 1.5rem 0;
    border-top: 1px solid #eee;
    transition: .2s ease-in-out;
    a {
      text-decoration: underline;
    }
    &:hover {
      background-color: #eee;
    }
    .head {
      font-size: 1.125rem;
      line-height: 2.5rem;
    }
    .li {
      line-height: 1.5rem;
      font-size: 0.875rem;
    }
    #chart {
      padding: 0 3rem;
      svg {
        width: 100%;
        height: 108px;
      }
      .years {
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        color: #888;
        font-style: italic;
        font-size: 13px;
      }
    }
  }
  .item-left {
    padding: 1rem 2rem;
    text-align: left;
  }
  .right {
    position: absolute;
    top: 3rem;
    right: -17rem;
    padding: .5rem 0 0 0;
    width: 15rem;
    border-radius: 1.5rem;
    background-color: #f6f6ff;
    text-align: left;
    overflow: hidden;
    .title {
      padding: .5rem 0 1rem 1rem;
      font-weight: bold;
    }
    a {
      display: block;
      padding: .75rem 1rem;
      border-top: 1px solid #eee;
      transition: .2s ease-in-out;
      font-size: .875rem;
      line-height: 1.25rem;
      span, div {
        display: inline-block;
        margin-right: .5rem;
        vertical-align: middle;
      }
    }
    .github {
      background-color: #eef;
      span {
        width: 1.25rem;
        height: 1.25rem;
        background-image: url('../../public/github.png');
        background-size: contain;
      }
    }
    .gmail{
      background-color: #f5f5f5;
      span {
        width: 1.25rem;
        height: 1.25rem;
        background-image: url('../../public/gmail.png');
        background-size: contain;
      }
    }
  }
}
@media (max-width: 750px) {
  .about {
    margin: 0 3rem;
    width: 100%;
    padding: 5rem 0;
    margin: 0;
    .right {
      position: relative;
      margin: 1rem auto;
      width: 15rem;
      right: 0;
      top: 0;
    }
  }
}
</style>