<template>
  <div class='wrapper'>
    <div class="content" v-for="(d, index) in data" :key='index' @click="open(d.Url)">
      <div class='title'>{{d.Title}}</div>
      <div class='heat' v-if='d.hotDesc'>{{d.hotDesc}}</div>
      <div class='date'>{{getDate(d.CreateTime)}}</div>
    </div>
    <div class="right">
      <div class='rbox'>
        <div class="title">Sites</div>
        <div v-for="(s, index) in sites" :key="index" class="ritem" @click="fetchData(s[0], index)" :class="{activeindex:active===index}">
          <span>{{s[1]}}</span>
        </div>
      </div>
      <div class='rbox'>
        <div class="title">Reference</div>
        <div class="ritem" @click='open("https://github.com/tophubs/TopList")'>
          数据接口来自：<br>
          https://github.com/tophubs/TopList<br>
          https://mo.fish/main/home/hot<br>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolRecord',
  data () {
    return {
      active: 0,
      data: [],
      sites: [[1, '知乎'], [59, 'V2EX'], [2, '虎扑'], [2, 'NGA'], [58, '微博'], [8, '虎嗅'], [12, '36Kr'], [112, 'IT之家']],
      savedData: {},
    }
  },
  created () {
    this.fetchData(this.sites[this.active][0], this.active)
  },
  beforeDestroy () {
  },
  computed: {
    getDate: function (time) {
      return time => {
        return (new Date(time*1000)).toISOString().split('T').join(' ').slice(0, -8)
      }
    }
  },
  methods: {
    fetchData (id, index) {
      this.active = index
      if (this.savedData[id] != undefined) {
        this.data = this.savedData[id]
      } else {
        fetch(`https://www.tophub.fun:8888/GetAllInfoGzip?id=${id}&page=0`)
        .then(res => {
          return res.json()
        }).then(json => {
          this.data = json.Data.slice(0,20)
          this.savedData[id] = this.data
        })
      }
    },
    open (url) {
      window.open(url, '_blank')
    },
  }
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  border-top: 1px solid #eee;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background-color .2s ease-in-out;
  &:hover {
    background-color: #eee;
  }
  .title {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: .5rem;
  }
  .date {
    flex: 1 1 auto;
    text-align: right;
  }
  .heat {
    flex: 0 0 auto;
    width: 10rem;
  }
  .date, .heat {
    color: #aaa;
    font-size: 12px;
  }
}
</style>