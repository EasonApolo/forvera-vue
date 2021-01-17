<template>
  <div class='button' :class='{small:size==0}'>{{content}}</div>
</template>

<script>
export default {
  name: 'home',
  props: ['content', 'size']
}
</script>

<style lang="scss" scoped>
.button {
  display: inline-block;
  padding: .2rem 1rem;
  border-radius: 2rem;
  border: 1px solid rgb(160, 160, 253);
  font-size: .875rem;
  transition: all .2s ease;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: white;
    background-color: rgb(160, 160, 253);
  }
}
.small {
  padding: .1rem .75rem;
  font-size: .75rem;
}
</style>