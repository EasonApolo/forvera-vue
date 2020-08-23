<template>
  <div class="tools">
    <layout v-if="active==undefined">
      <template #main>
        <list>
          <template #list>
            <div class="item tool" v-for="(tool, index) in tools" :key="index" @click="active=tool" :class="tool">
              {{toolName[tool]}}
            </div>
          </template>
        </list>
      </template>
    </layout>
    <component v-if='active' v-bind:is="active"></component>
  </div>
</template>

<script>
import ToolRegex from '../components/ToolRegex'
import ToolRecord from '../components/ToolRecord'
import ToolChess from '../components/ToolChess'
import ToolMofish from '../components/ToolMofish'
import Layout from '@/components/Layout.vue'
import Rbox from '@/components/Rbox.vue'
import List from '@/components/List.vue'
export default {
  name: 'tool',
  components: {
    'regex': ToolRegex,
    'record': ToolRecord,
    'chess': ToolChess,
    'mofish': ToolMofish,
    'layout': Layout,
    'rbox': Rbox,
    'list': List,
  },
  data () {
    return {
      active: undefined,
      tools: ['regex', 'record', 'chess', 'mofish'],
      toolName: {
        regex: '正则提取',
        record: '录音机',
        chess: '自走棋',
        mofish: '摸鱼',
      },
    }
  },
  mounted () {
    this.$bus.$on('goback', () => this.active = undefined)
  },
  methods: {
    back () {
      this.active = undefined
    },
  },
}
</script>

<style lang="scss">
.tools {
  .tool {
    text-align: center;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  .back {
    position: absolute;
    left: 0;
    top: 0;
    padding: .5rem 2rem;
    width: calc(100% - 4rem);
    height: 2rem;
    line-height: 2rem;
    text-align: left;
    font-size: .875rem;
    cursor: pointer;
    transition: background-color .2s ease-in-out;
    &:hover {
      background-color: #f6f6fc;
    }
    .back-icon {
      position: absolute;
      left: 1rem;
      top: 1.125rem;
      height: .75rem;
      width: .75rem;
      background-size: contain;
      background-image: url(../../public/left.png);
      transition: transform .2s ease-in-out;
    }
    &:hover .back-icon{
      transform: translateX(-5px);
    }
  }

  .right {
    .rbox {
      .activeindex {
        background-color: #eeeef4;
      }
      .ritem {
        .remove {
          float: right;
          width: 1rem;
          height: 1rem;
          background-image: url(../../public/remove.png);
          background-size: contain;
        }
      }
    }
  }
}
</style>