<template>
  <div class='wrapper'>
    <div class="content">
      <textarea id="input" placeholder="input" rows="10" v-model="reg.input"></textarea>
      <div style="position:relative">
        <textarea id="reg" placeholder="regular expression" rows="2" v-model="reg.reg"></textarea>
        <button id="save" @click="save">保存</button>
      </div>
      <button id="parse" @click="parse">提取</button>
      <textarea id="output" placeholder="output" rows="10" v-text="reg.output"></textarea>
      <span id="count" v-text="count"></span>
    </div>
    <div class="right">
      <div class='rbox'>
        <div class="title">已保存的正则表达式</div>
        <div v-for="(reg, index) in reglist" :key="index" :class="{activeindex:listindex===index}" class="ritem" @click="replace(index)">
          <span>{{reg}}</span>
          <span class="remove" @click.stop="remove(index)"></span>
        </div>
      </div>
      <div class='rbox'>
        <div class="title">说明</div>
        <div class="ritem"><b>特点</b><br>给目标词语加上()可以单独提取词语，多个词语自动用tab分隔，可以直接复制进Excel。</div>
        <div class="ritem"><b>例子</b><br><i style='color:#aaa'>epoch 3500: acc 77.6%, loss 1.3</i><br>epoch\s(\d+).+([\d\.]+),.+([\d\.]+)<br>> 3500	77.6	1.353</div>
        <div class="ritem flex-item">
          <span><b>常用</b></span>
          <span>\s空格</span>
          <span>\d数字</span>
          <span>\w字母</span>
          <span>.任意字符</span>
          <span>+一个或以上</span>
          <span>*零个或以上</span>
          <span>[]可替换</span>
          <span>\n \t</span></div>
      </div>
    </div>
  </div>
</template>


<script>
import bus from '../bus.js'
export default {
  name: 'ToolRegex',
  data () {
    return {
      listindex: -1,
      // reg
      reg: {
        input: '',
        reg: '',
        output: '',
        c: 0
      },
      reglist: [],
    }
  },
  components: {
  },
  created () {
    if (localStorage.regex === 'undefined' || localStorage.regex === undefined) {
      localStorage.regex = []
    }
    this.reglist = JSON.parse(localStorage.regex)
  },
  beforeDestroy () {
    this.listindex = -1
  },
  computed: {
    count: function () {
      return this.reg.c + ' 个结果'
    }
  },
  methods: {
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
      this.reg.c = c
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
.content {
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
    padding: .375rem 1rem;
    background-color: white;
    border: solid 1px #ccf;
    border-radius: 1rem;
    cursor: pointer;
    outline: none;
    transition: 0.2s ease;
    &:hover {
      background-color: #ccf !important;
      color: white;
    }
  }
  #save {
    position: absolute;
    right: 5%;
    top: .5rem;
    background-color: transparent;
  }
}
.right {
  .flex-item {
    display: flex;
    flex-flow: wrap;
    span {
      flex: 1 1 auto;
    }
  }
}
</style>