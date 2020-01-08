<template>
  <div class="tool">
    <div class='wrapper' v-if="active==undefined">
      <div class="content">
        <div class="choice" v-for="(tool, index) in tools" :key="index" @click="active=tool" :class="tool">
          {{toolName[tool]}}
        </div>
      </div>
    </div>
    <div class="back" v-show="active!==undefined" @click="back()">
      <div class='back-icon'></div>返回
    </div>
    <component v-if='active' v-bind:is="active"></component>
  </div>
</template>

<script>
import ToolRegex from '../components/ToolRegex'
import ToolRecord from '../components/ToolRecord'
import ToolChess from '../components/ToolChess'
import ToolMofish from '../components/ToolMofish'
export default {
  name: 'tool',
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
  components: {
    'regex': ToolRegex,
    'record': ToolRecord,
    'chess': ToolChess,
    'mofish': ToolMofish,
  },
  methods: {
    back () {
      this.active = undefined
    },
  },
}
</script>

<style lang="scss">
.tool {
  position: relative;
  margin: 0 0 0 30%;
  width: 40%;
  min-height: 100vh;
  border-right: 1px solid #eee;
  .wrapper {
    box-sizing: content-box;
    padding-bottom: 5rem;
    padding-top: 3rem;
  }
  .content {
    border-top: 1px solid #eee;
    .choice {
      padding: 1rem;
      height: 3rem;
      line-height: 3rem;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      &:hover {
        background-color: #fafafa;
      }
    }
    .item {
      padding: 1rem 2rem;
      border-bottom: 1px solid #eee;
      line-height: 1.25rem;
      font-size: .875rem;
      transition: .2s ease-in-out;
      &:hover {
        background-color: #eee;
      }
      .fulllink {
        display: inline-block;
        width: 100%;
      }
    }
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
    position: absolute;
    top: 3rem;
    right: -17rem;
    padding: .5rem 0 0 0;
    width: 15rem;
    .rbox {
      margin-bottom: 1rem;
      border-radius: 1rem;
      background-color: #f6f6fc;
      text-align: left;
      overflow: hidden;
      .title {
        padding: 1rem;
        font-weight: bold;
      }
      .activeindex {
        background-color: #eeeef4;
      }
      .ritem {
        padding: .75rem 1rem;
        border-top: 1px solid #eee;
        font-size: .875rem;
        line-height: 1.25rem;
        transition: background-color .2s ease-in-out;
        span {
          word-wrap: break-word;
          vertical-align: middle;
        }
        cursor: pointer;
        &:hover {
          background-color: #eeeef4;
        }
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
@media (max-width: 750px) {
  .tool {
    margin-left: 0;
    padding-right: 0;
    width: 100%;
    border-right: none;
    .right {
      position: relative;
      display: block;
      width: calc(100% - 4rem);
      left: 0;
      top: 0;
      margin: 2rem 2rem 5rem 2rem;
    }
  }
}
</style>