<template>
  <div class='wrapper'>
    <div class="content">
      <audio :src="rec.src" controls></audio>
      <div class="item description">{{rec.date}}<br>{{rec.description}}</div>
    </div>
    <div class="right">
      <div class='rbox'>
        <div class="title">播放列表</div>
        <div v-for="(r, index) in reclist" :key="index" class="ritem" @click="play(index)" :class="{activeindex:listindex===index}">
          <span @click="play(index)" >{{r.title.rendered}}</span>
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
      listindex: -1,
      // rec
      reclist: [],
      rec: {
        src: '',
        date: '',
        description: ''
      }
    }
  },
  created () {
    this.fetchRecList()
  },
  beforeDestroy () {
    this.recsrc = ''
    this.recdescription = ''
  },
  methods: {
    fetchRecList () {
      console.log(window.ip + 'media?media_type=audio')
      fetch(window.ip + 'media?media_type=audio')
      .then(res => {
        return res.json()
      }).then(json => {
        this.reclist = json
      })
    },
    play (index) {
      this.listindex = index
      this.rec.src = this.reclist[index].source_url
      this.rec.description = this.reclist[index].description.rendered.split(/<p>|<\/p>/).slice(-2, -1)[0]
      this.rec.date = this.reclist[index].date.split('T').join(' ').slice(0, -3)
    },
  }
}
</script>

<style scoped lang="scss">
.content {
  padding-top: 1rem;
  border-top: 1px solid #eee;
  .description {
    text-align: left;
  }
}
</style>