<template>
  <div class="tool">
    <div class="content" v-show="active=='choose'">
      <div class="choice" v-for="(tool, index) in tools" :key="index" @click="active=tool">
        {{tool}}
      </div>
    </div>
    <div class="content" v-show="active=='regexp'">
      <textarea id="input" placeholder="input" rows="10" v-model="input"></textarea>
      <textarea id="reg" placeholder="regular expression" rows="2" v-model="reg"></textarea>
      <button id="parse" @click="parse">parse</button>
        <button id="save" @click="save">save this regexp</button>
      <textarea id="output" placeholder="output" rows="10" v-text="output"></textarea>
      <span id="count" v-text="count"></span>
    </div>
    <div class="right" v-show="active=='regexp'">
      <div class="title">saved regexp</div>
      <div v-for="(reg, index) in regs" :key="index" class="regl">
        <span @click="replace(index)">{{reg}}</span>
        <span class="remove" @click="remove(index)"></span>
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
      tools: ['regexp'],
      input: '',
      reg: '',
      output: '',
      c: 0,
      regs: []
    }
  },
  components: {

  },
  created () {
    this.regs = localStorage.regex !== 'undefined' ? JSON.parse(localStorage.regex) : []
  },
  computed: {
    count: function () {
      return this.c + ' result(s)'
    }
  },
  methods: {
    parse: function () {
      this.clearOutput()
      if(this.reg === '') {
        bus.$emit('pop', '你还没有填正则表达式嘞')
        return
      }
      let reg = new RegExp(this.reg, 'g')
      let c = 0
      let result = null
      while ((result = reg.exec(this.input)) != null)  {
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
      this.output = ''
    },
    print: function (out, c) {
      this.output = this.output + out
      this.c = c
    },
    replace: function (index) {
      this.reg = this.regs[index]
    },
    remove: function (index) {
      this.regs.splice(index, 1)
    },
    save: function () {
      this.regs.unshift(this.reg)
      bus.$emit('pop', '已保存在saved regexp中')
    }
  },
  watch: {
    'regs': function () {
      localStorage.regex = JSON.stringify(this.regs)
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
  .choice {
    margin: 0 3rem;
    height: 3rem;
    border: 3px solid #aaf;
    border-radius: 2rem;
    line-height: 3rem;
    cursor: pointer;
    transition: .3s ease-in-out;
    &:hover {
      color: white;
      background-color: #aaf;
    }
  }
  textarea, button {
    display: block;
    margin: 0 auto 1rem auto;
    transition: all .2s ease;
  }
  textarea {
    width: 90%;
    border: 1px solid #ddf;
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
  .right {
    position: absolute;
    width: 15rem;
    top: 3rem;
    right: -15rem;
    .regl {
      margin: .5rem 0;
      cursor: pointer;
    }
    .title {
      padding: .5rem;
      border-bottom: 1px solid #eee;
    }
  }
  .remove {
    display: inline-block;
    margin-left: 1rem;
    width: 1rem;
    height: 1rem;
    background-image: url(../../public/remove.png);
    background-size: contain;
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
      width: 100%;
      left: 0;
      top: 0;
      margin: 2rem 0 5rem 0;
    }
  }
}
</style>