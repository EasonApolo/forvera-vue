<template>
  <div class="list">
    <Loading :intSwitch=loading></Loading>
    <slot name='list'></slot>
    <!-- <div class="item" v-for="(item, index) in items" :key="item.id" :data-index="index" @click="toArt(item.id)">
      <div class="title">
        <span>{{item.title.rendered}}</span>
        <span class="time">{{slicedDate(item.date)}}</span>
      </div>
      <div class="content">
        {{slicedContent(item.content.rendered)}}
      </div>
    </div> -->
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
export default {
  name: 'List',
  props: ['loading'],
  data () {
    return {
      intSwitch: 0
    }
  },
  components: {
    Loading
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list {
  position: relative;
  padding-top: 3rem;
}
.list-complete-move {
  transition: all .1s;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(-.5rem);
}
.loading-wrapper {
  width: 100%;
  .loading {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0 auto;
    background-image: url(../../public/load.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.item {
  display: block;
  width: calc(100% - 4rem);
  left: 0;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  text-align: left;
  transition: all .3s;
  cursor: pointer;
  &:hover {
    background-color: #f6f6f6;
  }
  .title {
    line-height: 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    transition: color .2s;
    .time {
      margin-left: 1rem;
      line-height: 1rem;
      font-size: 0.875rem;
      font-weight: normal;
      color: #888;
    }
  }
  .content {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.375rem;
    color: #555;
    word-wrap: break-word;
  }
}
.item-child {
  margin-top: 1rem;
  padding-bottom: 0;
  border-bottom: 0;
}
.list > .item {
  border-top: 1px solid #eee;
}
.list > .item ~ .item {
  border-top: none;
}

@media (max-width: 750px) {
  .list {
    padding-top: 0;
  }
}
</style>