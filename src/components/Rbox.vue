<template>
  <ul class="rbox" :class='{expand:expand}'>
    <div class='title' @click='expand=!expand'>{{title}}</div>
    <slot name='list'></slot>
  </ul>
</template>

<script>
export default {
  name: 'layout',
  props: ['title'],
  data () {
    return {
      expand: false,
    }
  }
}
</script>

<style scoped lang="scss">
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
  .item {
    display: block;
    padding: .75rem 1rem;
    border-top: 1px solid #eee;
    font-size: .875rem;
    line-height: 1.25rem;
    transition: background-color .2s ease-in-out;
    cursor: pointer;
    &:hover {
      background-color: #eeeef4;
    }
  }
  .disabled {
    color: #888;
  }
  .active {
    background-color: #f1f1ff;
  }
  .no-border {
    border: none;
  }
  .second {
    border: none;
    padding: .25rem 1.5rem .25rem 2rem !important;
    color: #888 !important;
  }
}
@media (max-width: 750px) {
  .rbox {
    display: flex;
    margin: 0;
    line-height: 1.5rem;
    align-items: center;
    border-top: 1px solid #eee;
    border-radius: 0;
    background-color: #fff;
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 0 !important;
    }
    .title {
      padding: .5rem 1rem;
      font-weight: normal;
      white-space: nowrap;
    }
    .active {
      background-color: #5C5FEA !important;
      color: #fff !important;
    }
  }
  .rbox:not(.expand) {
    .item {
      margin-right: .5rem;
      padding: 0 .625rem !important;
      height: 1.8rem;
      line-height: 1.8rem;
      background-color: #eee;
      border-radius: 1rem;
      border: none;
      white-space: nowrap;
    }
    .plain {
      padding: 0 !important;
    }
  }
  .expand {
    display: block;
    .item {
      height: auto;
      line-height: autol;

    }
  }
}
</style>