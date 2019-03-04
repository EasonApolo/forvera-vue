<template>
  <div class="about">
    Welcome to the Grand Tournament, Champion. 
    <div class="right">
      <a href="https://github.com/EasonApolo"><div class="icon"></div><div>EasonApolo</div></a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  position: relative;
  margin: 0 30%;
  padding: 3rem;
  .right {
    position: absolute;
    width: 15rem;
    right: -15rem;
    top: 3rem;
    a {
      display: block;
      margin-bottom: 1rem;
      height: 3rem;
      line-height: 3rem;
      background-color: #eef;
      border-radius: 1rem;
      font-size: .875rem;
      div {
        display: inline-block;
        margin-right: .5rem;
        vertical-align: middle;
      }
    }
    .icon {
      width: 1.25rem;
      height: 1.25rem;
      background-image: url('../../public/github.png');
      background-size: contain;
    }
  }
}
@media (max-width: 750px) {
  .about {
    margin-left: 0;
    width: 100%;
    padding: 5rem 0;
    margin: 0;
    .right {
      position: relative;
      margin: 1rem auto;
      width: 15rem;
      right: 0;
      top: 0;
    }
  }
}
</style>