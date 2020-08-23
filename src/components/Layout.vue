<template>
  <div class='container'>
    <div class='main'>
      <slot name='main'></slot>
    </div>
    <div class='right'>
      <slot name='right'></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 0 0 0 11rem;
  height: 100vh;
  .main {
    position: relative;
    height: calc(100% - 3rem);
    margin-right: 16rem;
    padding-bottom: 3rem;
    border-right: 1px solid #eee;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .right {
    margin-left: 2rem;
    height: calc(100% - 3rem);
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 3rem;
    width: 14rem;
    overflow-y: auto;
  }
}

@media (max-width: 750px) {
  .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0;
    height: calc(100vh - 4rem - 1px);
    .main {
      margin: 0;
    }
    .right {
      position: relative;
      flex: 0 0 auto;
      margin: 0;
      padding: 0;
      width: 100%;
      height: auto;
      top: auto;
      left: 0;
      right: 0;
      background-color: transparent;
    }
  }
}
</style>