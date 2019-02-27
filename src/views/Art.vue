<template>
  <div class="art">
    <div class="article" v-if="artData.title">
      <div class="title">{{artData.title.rendered}}</div>
      <div class="time">{{artData.date}}</div>
      <div class="content" v-html="artData.content.rendered"></div>
    </div>
    <Loading :intSwitch=switch1></Loading>
    <div id="comment-header">> 评论 { {{commentsData.length}} }</div>
    <div class="comment-wrapper" v-if="commentsLoadOK">
      <div v-for="(comment, index) in commentsData" :key="comment.id" class="comment">
        <span class="name">{{comment.author_name}}</span>
        <span v-if="comment.parent !== 0" class="replyto"> > {{replyToName(comment.toIndex)}}</span>
        <span class="content">: {{comment.content.rendered.replace(/<[^>]*>/g, '')}}</span>
        <span class="add" @click="commentToIndex = index">评论</span>
        <span class="time">{{comment.date}}</span>
      </div>
    </div>
    <Loading :intSwitch=switch2></Loading>
    <ul class="add">
      <li>> 添加评论<span v-show="commentToIndex !== -1" class="addTo">
          对  <i> {{commentToName}} </i> 
          <span id="removeAddTo" @click="commentToIndex = -1">取消</span></span>
      </li>
      <li><textarea name="content" rows="2" placeholder="评论" v-model="addContent"/></li>
      <li><input name="name" placeholder="名字" v-model="addName"></li>
      <li><input type="submit" value="提交" @click="addComment" :class="{disabled:addSending}"></li>
    </ul>
    <div id="toTop" v-show="scrollY > 800" @click="scrollToTop"></div>
  </div>
</template>

<script>
import bus from '@/bus.js'
import Loading from '@/components/Loading.vue'
export default {
  name: 'art',
  data () {
    return {
      postId: 0,
      //data
      artData: {
      },
      commentsData: {},
      commentsLoadOK: false,
      navData: [],
      //other setting
      switch1: 0,
      switch2: 0,
      scrollY: 0,
      //addComment
      commentToIndex: -1,
      addName: '',
      addContent: '',
      addSending: false,
    }
  },
  components: {
    Loading
  },
  computed: {
    replyToName: function () {
      return id => this.commentsData[id].author_name
    },
    commentToName: function () {
      let i = this.commentsData[this.commentToIndex]
      return i ? i.author_name : ''
    }
  },
  created () {
    this.postId = this.$route.query.id
    this.fetchArticle()
    this.fetchComment()
    window.addEventListener('scroll', this.scroll)
  },
  methods: {
    scroll: function () {
      this.scrollY = document.documentElement.scrollTop || 
                window.pageYOffset || 
                document.body.scrollTop;
    },
    scrollToTop: function () {
      let h = this.scrollY
      let i = 0
      let intt = setInterval(() => {
        //200*0.012=2.4s
        i+=0.006
        //偶数次方用1-Math，奇数次用1+Math
        document.documentElement.scrollTop = h - h * (1-Math.pow(i-1, 8))
        if (i >= 1) clearInterval(intt)
      }, 12)
    },
    addComment () {
      if (this.addSending) return
      if (this.addContent.replace(/\s+/g, '') === '') {
        bus.$emit('pop', '姓名或评论不能为空*A*')
        return
      }
      this.addSending = true
      let form = new FormData()
      let parent = this.commentToIndex == -1 ? 0 : this.commentsData[this.commentToIndex].id
      form.append('author_name', this.addName)
      form.append('content', this.addContent)
      form.append('parent', parent)
      form.append('post', this.postId)
      form.append('author_email', '787817128@qq.com')
      fetch(window.ip + 'comments', {
        method: 'POST',
        body: form
      }).then(() => {
        this.addSending = false
        this.addName = this.addContent = ''
        this.commentToIndex = -1
        this.fetchComment()
      })
      return 0
    },
    fetchArticle () {
      this.switch1 = 1
      fetch(window.ip + 'posts/' + this.postId)
      .then(res => {
        return res.json()
      }).then(json => {
        this.artData = json
        this.switch1 = 0
      })
    },
    fetchComment () {
      this.switch2 = 1
      fetch(window.ip + 'comments?post=' + this.postId)
      .then(res => {
        return res.json()
      }).then(json => {
        this.commentsData = json
        let l = this.commentsData.length
        for (let i = 0; i < l; i++) {
          let to = this.commentsData[i].parent
          if (to !== 0) {
            for (let j = i; j < l; j++) {
              if (this.commentsData[j].id === to) {
                this.commentsData[i].toIndex = j
                break
              }
            }
          }
        }
        this.switch2 = 0
        this.commentsLoadOK = true
      })
    },
    reload (index) {
      let id = this.navData[index].id
      if (id === -1) {
        bus.$emit('pop', this.navData[index].title)
        return
      }
      this.$router.push({path: 'art', query: {id: id}})
      this.postId = this.$route.query.id
      this.artData = {}
      this.commentsData = {}
      this.commentsLoadOK = false
      this.navData = []
      //other setting
      this.scrollY = 0
      //addComment
      this.commentToIndex = -1
      this.addName = ''
      this.addContent = ''
      this.fetchArticle()
      this.fetchComment()
    }
  }
}
</script>

<style lang="scss" scoped>
.art {
  position: relative;
  margin-left: 30%;
  margin-right: 30%;
}
.article {
  padding: 2rem;
  .time {
    padding: .5rem 0;
    color: #888;
    font-size: 0.875rem;
  }
  .content {
    font-size: 0.875rem;
    text-align: left;
    line-height: 1rem;
  }
}
#comment-header {
  padding: 0 2rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  text-align: left;
}
.comment-wrapper {
  padding: 0 2rem 2rem 2rem;
  text-align: left;
  .comment {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    .name {
      font-size: 0.875rem;
    }
    .time, .add{
      opacity: 0;
      color: #AAA;
      transition: .3s ease;
      margin-left: .5rem;
    }
    .add {
      margin-left: 1rem;
      cursor: pointer;
    }
    &:hover .time {
      opacity: 1;
    }
    &:hover .add {
      opacity: 1;
      margin-left: .5rem;
    }
  }
}
.add {
  margin: 0 2rem;
  text-align: left;
  font-size: 0.875rem;
  li {
    margin-bottom: 1rem;
    span {
      margin-right: 1rem;
    }
  }
  #removeAddTo {
    cursor: pointer;
    color: #888;
  }
  li:first-child span:first-child {
    margin-left: 1rem;
  }
  li:last-child span{
    display: inline-block;
    height: 2rem;
  }
  input, textarea {
    line-height: 1.5rem;
    padding: .25rem .625rem;
    border: 1px #ddd solid;
    transition: .2s ease;
    outline: none;
    color: #2c3e50;
    resize: none;
    width: 8rem;
    font-family: Arial, Helvetica, sans-serif;
  }
  input[type=submit] {
    width: 4rem;
  }
  .disabled {
    color: #AAA;
  }
  textarea {
    width: 20rem;
  }
  input:focus {
    border: 1px #4FB9F1 solid;
  }
  textarea:focus {
    border: 1px #4FB9F1 solid;
  }
}
#toTop {
  position: fixed;
  width: 2rem;
  height: 2rem;
  right: 2rem;
  bottom: 8rem;
  background-color: #eeeeff;
  background-image: url(../../public/top.png);
  background-size: 40% 40%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  border-radius: 50%;
  cursor: pointer;
}
@media (max-width: 750px) {
  .art {
    margin: 0 0 4rem 0;
    padding: 0;
  }
  .comment .time {
    display: none;
  }
  #toTop {
    display: none;
  }
  .art .add li textarea {
    width: calc(100% - 22px);
  }
}
</style>
<style>
.art .article .content p{
  line-height: 1.375rem;
  margin: 0.75rem 0;
  word-wrap: break-word;
}
.art .article .content .code {
  padding: .75rem;
  background-color: #DDD;
  font-family: "monospace";
  border-radius: .5rem;
}
.art .article .content .mark {
  background-color: #DDD;
}
.art .article .content a {
  text-decoration: underline;
}
.art .article .content img {
  display: block;
  margin: 2rem auto;
  max-width: 70%;
  height: auto;
}
.art .article .content .img-note {
  margin-top: -1rem;
  text-align: center;
  font-size: 13px;
}
@media (max-width: 750px) {
  .art .article .content img {
    max-width: 100%;
    height: auto;
  }
}
</style>