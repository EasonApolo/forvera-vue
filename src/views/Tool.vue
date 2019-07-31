<template>
  <div class="tool">
    <div class="content" v-show="active=='choose'">
      <div class="choice" v-for="(tool, index) in tools" :key="index" @click="active=tool" :class="tool">
        {{toolName[tool]}}
      </div>
    </div>
    <div class="back" v-show="active!=='choose'" @click="back()">返回</div>

    <div class="content regcontent" v-if="active=='regexp'">
      <textarea id="input" placeholder="input" rows="10" v-model="reg.input"></textarea>
      <div style="position:relative">
        <textarea id="reg" placeholder="regular expression" rows="2" v-model="reg.reg"></textarea>
        <button id="save" @click="save">保存</button>
      </div>
      <button id="parse" @click="parse">提取</button>
      <textarea id="output" placeholder="output" rows="10" v-text="reg.output"></textarea>
      <span id="count" v-text="count"></span>
    </div>
    <div class="right" v-if="active=='regexp'">
      <div class="title">已保存的正则表达式</div>
      <div v-for="(reg, index) in reglist" :key="index" :class="{activeindex:listindex===index}" class="regl" @click="replace(index)">
        <span>{{reg}}</span>
        <span class="remove" @click.stop="remove(index)"></span>
      </div>
    </div>
    
    <div class="content reccontent" v-if="active=='record'">
      <audio :src="rec.src" controls></audio>
      <div class="description">{{rec.date}}<br>{{rec.description}}</div>
    </div>
    <div class="right" v-if="active=='record'">
      <div class="title">播放列表</div>
      <div v-for="(r, index) in reclist" :key="index" class="regl" @click="play(index)" :class="{activeindex:listindex===index}">
        <span @click="play(index)" >{{r.title.rendered}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import bus from '@/bus.js'
export default {
  name: 'tool',
  data () {
    return {
      active: 'choose',
      tools: ['regexp', 'record'],
      toolName: {
        regexp: '正则表达式文本提取',
        record: '录音播放'
      },
      listindex: -1,
      // reg
      reg: {
        input: '',
        reg: '',
        output: '',
        c: 0
      },
      reglist: [],
      // rec
      reclist: [],
      rec: {
        src: '',
        date: '',
        description: ''
      }
    }
  },
  components: {

  },
  created () {
    if (localStorage.regex === 'undefined' || localStorage.regex === undefined) {
      localStorage.regex = []
    }
    this.reglist = JSON.parse(localStorage.regex)
    this.fetchRecList()
  },
  computed: {
    count: function () {
      return this.reg.c + ' 个结果'
    }
  },
  methods: {
    back () {
      this.active = 'choose'
      this.listindex = -1
      this.recsrc = ''
      this.recdescription = ''
    },
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
    //reg
    parse: function () {
      this.clearOutput()
      if(this.reg.reg === '') {
        bus.$emit('pop', '你还没有填正则表达式嘞')
        return
      }
      let reg = new RegExp(this.reg.reg, 'g')
      let c = 0
      let result = null
      while ((result = reg.exec(this.reg.input)) != null)  {
          c++
          if (result.length > 1) {
              result = result.splice(1).join('\t');
          }
          this.print(result + "\r\n", c);
      }
      if (c === 0) {
          this.print("", 0);
      }
      bus.$emit('pop', '提取完成')
    },
    clearOutput: function () {
      this.reg.output = ''
    },
    print: function (out, c) {
      this.reg.output = this.reg.output + out
      this.c = c
    },
    replace: function (index) {
      this.reg.reg = this.reglist[index]
      this.listindex = index
    },
    remove: function (index) {
      this.reglist.splice(index, 1)
      this.listindex = -1
    },
    save: function () {
      this.reglist.unshift(this.reg.reg)
      bus.$emit('pop', '已保存在saved regexp中')
    }
  },
  watch: {
    'reglist': function () {
      localStorage.regex = JSON.stringify(this.reglist)
    }
  }
}
</script>

<style scoped lang="scss">
.tool {
  position: relative;
  margin: 0 30% 5rem 30%;
  padding-top: 3rem;
  width: 40%;
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
  }
  .back {
    position: absolute;
    left: .5rem;
    top: .5rem;
    width: 4rem;
    height: 2rem;
    line-height: 2rem;
    border-radius: 1rem;
    font-size: .875rem;
    background-color: #f4f4ff;
    cursor: pointer;
    transition: .2s ease-in-out;
    &:hover {
      background-color: #eef;
    }
  }

  .regcontent {
    padding-top: 1rem;
    textarea, button {
      display: block;
      margin: 0 auto 1rem auto;
      transition: all .2s ease;
    }
    textarea {
      padding: .5rem;
      width: 90%;
      border: 1px solid #eee;
      &:focus {
        border-color: #aaf;
      }
    }
    button {
      padding: .25rem .5rem;
      background-color: white;
      border: solid 1px #ccf;
      border-radius: .75rem;
      cursor: pointer;
      outline: none;
    }
    #save {
      position: absolute;
      right: 5%;
      top: .5rem;
      background-color: transparent;
    }
  }

  .reccontent {
    padding-top: 1rem;
    .description {
      margin: 1rem auto;
      padding: 1rem 2rem;
      border-bottom: 1px solid #eee;
      line-height: 1.25rem;
      text-align: left;
      font-size: .875rem;
      transition: .2s ease-in-out;
      &:hover {
        background-color: #eee;
      }
    }
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
    .activeindex {
      background-color: #eef;
    }
    .regl {
      padding: .75rem 1rem;
      border-top: 1px solid #eee;
      transition: .2s ease-in-out;
      font-size: .875rem;
      line-height: 1.25rem;
      span {
        word-wrap: break-word;
        vertical-align: middle;
      }
      cursor: pointer;
      &:hover {
        background-color: #f0f0ff;
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
@media (max-width: 750px) {
  .tool {
    margin-left: 0;
    padding-right: 0;
    width: 100%;
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