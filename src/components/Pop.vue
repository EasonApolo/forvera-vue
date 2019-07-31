<template>
  <div class="pop" :class="{show:show}">
    {{mes}}
  </div>
</template>

<script>
import bus from '@/bus.js'
export default {
  name: 'pop',
  data () {
    return {
      mes: '',
      show: false
    }
  },
  created () {
    bus.$on('pop', this.handler)
  },
  methods: {
    handler: function (mes) {
      if (this.show) return
      this.mes = mes
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 2500)
    }
  }
}
</script>

<style lang="scss" scoped>
.pop {
  position: fixed;
  display: inline-block;
  bottom: 2rem;
  right: 2rem;
  padding: .75rem 1.5rem;
  z-index: 1;
  font-size: .875rem;
  background-color: #f1f1ff;
  opacity: 0;
  transition: .4s ease-in-out;
  transform: translateX(100%);
}
.show {
  transform: translateX(0);
  opacity: 1;
}
</style>