<template>
  <div class="edit">
    <layout>
      <template #main>
        <list>
          <template #list>
            <textarea class='item' id='title' v-model='title' placeholder="title"></textarea>
            <textarea class='item' id='description' v-model='description' laceholder="描述"></textarea>
            <div class='item' id='styling'>
              <btn :size=0 @click='makeBold'>bold</btn>
              <div class='btn-group'>
                <btn :size=0 :mr=0.25 @click='makeH4'>h4</btn>
                <btn :size=0 :mr=0 @click='makeNormal'>main</btn>
              </div>
              <span v-if='setWidth.target' id='set-width' class='btn-group'>
                <label for='set-width'>设置图片宽度</label>
                <input v-model='setWidth.width'>
                <btn :size=0 :mr=0 @click='setImgWidth'>ok</btn>
              </span>
            </div>
            <div class='item' id='content' ref='content' contenteditable="true"
              placehoder='content' v-html='content'>
            </div>
            <div class='actions'>
              <btn @click='publish()'>发布</btn>
              <btn @click='deletePostHandler()' :type='"warning"'>删除</btn>
            </div>
          </template>
        </list>
      </template>
      <template #right>
        <rbox title='状态'>
          <template #list>
            <div class='item' :class='{active:status==0}' @click='status=0'>隐藏</div>
            <div class='item' :class='{active:status==1}' @click='status=1'>公开</div>
          </template>
        </rbox>
        <rbox title='分类'>
          <template #list>
            <div v-for='c in cats' :key='c._id'
              class='item' :class='{active:c.active}' @click='toggleCat(c)'>{{c.title}}
            </div>
          </template>
        </rbox>
        <rbox title='图片上传'>
          <template #list>
            <div class='item' id='file-uploader'>
              <label>
                <input id='input-file' ref='inputFile' type="file" accept="image/*" @change="selectImage">
                <btn @click='selectImageTrigger'>选择</btn>
              </label>
              <span>{{ fileMessage }}</span>
              <btn id='upload' @click='upload'>上传</btn>
              <div id='preview' v-if='preview.data'>
                <img :src='preview.data'>
                <span>{{ preview.blob.name }}</span>
              </div>
            </div>
            <div class='item thumb-container' v-if="files.length>0">
              <div class='thumb' v-for='f in files' :key='f.name'>
                <img :src='f.url'  @click='insertImage(f)'>
                <div>{{ f.name }}</div>
              </div>
            </div>
          </template>
        </rbox>
        <rbox title='自动保存'>
          <template #sup>{{autoSaveStatus}}</template>
          <template #list>
            <div v-for='(s, index) in saves' :key='index'
              class='item' @click='recover(s)'>{{s.time}}
            </div>
          </template>
        </rbox>
      </template>
    </layout>
  </div>
</template>

<script>
import Layout from '@/components/Layout.vue'
import List from '@/components/List.vue'
import Rbox from '@/components/Rbox.vue'
import { request } from '@/shared/Request'
import { Button } from '@/components/Button.js'
import { getNowString, readFile } from '@/shared/helper'
import { ip } from '@/shared/config'

export default {
  name: 'edit',
  data () {
    return {
      postId: undefined,
      title: '',
      description: '',
      content: '',
      cats: [],
      status: 0,
      // autoSave
      autoSaveHandler: undefined,
      saves: [],
      // upload
      preview: {},
      files: [],
      fileMessage: '',
      // set width
      setWidth: { target: undefined, width: 0 }
    }
  },
  components: {
    'layout': Layout,
    'list': List,
    'rbox': Rbox,
    'btn': Button,
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    isActive (id) {
      return function () {
        return this.cats.findIndex(c => c._id == id) > 0
      }
    },
    autoSaveStatus () {
      return this.autoSaveHandler ? '每60s' : 'ERR: autoSave undefined'
    },
    noteStatus () {
      return this.$store.state.note
    }
  },
  async beforeRouteEnter (to, from, next) {
    from.name ? next() : next('/profile')
  },
  async beforeRouteLeave (to, from, next) {
    this.disableAutoSave()
    next()
  },
  mounted () {
    this.enableAutoSave()
    this.init()
    this.saves = this.loadSaved()
  },
  methods: {
    async init () {
      let post_id = this.$route.params._id
      let catsPromise = this.getCats()
      if (post_id) {
        this.postId = post_id
        let postPromise = request(`post/${ post_id }`, 'GET')
        let [_, post] = [await catsPromise, await postPromise]
        this.initSetData(post_id, post)
      } else {
        let newPost = await request(`post`, 'POST')
        this.postId = newPost._id
      }
    },
    initSetData (post_id, post) {
      this.initFiles()
      this.title = post.title
      this.description = post.description
      this.content = post.content
      this.status = post.status
      post.category.map(selected_id => {
        let cat = this.cats.find(c => c._id == selected_id)
        if (cat) cat.active = true
      })
    },
    async publish () {
      let content = this.$refs.content.innerHTML
      if (this.title.length < 1 || this.content.length < 1) return
      this.$store.commit('notify', { content: '发布中' })
      const selectedCats = this.cats.filter(c => c.active)
      let payload = {
        title: this.title, description: this.description,
        content: content, category: selectedCats, time: Date.now(),
        status: this.status
      }
      // request
      let res = await request(`post/${ this.postId }`, 'PUT', JSON.stringify(payload))
      this.$store.commit('notify', { content: '发布成功' })
      this.$router.push({ path: 'profile'})
    },
    async deletePostHandler () {
      this.$store.commit('notify', { content: '确定要删除吗？', confirm: false, name: 'deletePost' })
      console.log(`Edit: commit notify: `, this.$store.state.note)
    },
    async deletePost () {
      let res = await request(`post/${ this.postId }`, 'DELETE')
      this.$router.push({ path: 'profile'})
    },
    /*
      editor
    */
    makeBold () {
      this.$refs.content.focus()
      document.execCommand('bold')
      this.$refs.content.focus()
    },
    makeH4 () {
      this.$refs.content.focus()
      document.execCommand('formatblock', false, 'h4')
      this.$refs.content.focus()
    },
    makeNormal () {
      this.$refs.content.focus()
      document.execCommand('formatblock', false, 'div')
      this.$refs.content.focus()
    },
    /*
      category setting
    */
    async getCats () {
      let cats = await request('cat')
      cats.map(c => c.active = false)
      this.cats = cats
    },
    toggleCat (cat) {
      cat.active = !cat.active
    },
    /*
      file upload
     */
    createFileObj (blob, base64) {
      return { name: blob.name || blob.originalname, data: base64, blob }
    },
    selectImageTrigger () {
      this.$refs.inputFile.click()
    },
    async selectImage (e) {
      this.fileMessage = ''
      if (e.target.files.length <= 0) return;
      let blob = e.target.files[0]
      // if (this.files.find(f => f.name == blob.name)) {
      //   this.fileMessage = '重复的文件'
      //   return
      // }
      let base64 = await readFile(blob)
      this.preview = { data: base64, blob }
    },
    async upload () {
      let blob = this.preview.blob
      const payload = { file: blob }
      let fd = await request(`file/uploadSingle/${ this.postId }`, 'POST', payload)
      fd.url = `${ ip }${ fd.url }`
      this.files.unshift(fd)
      this.preview = {}
    },
    async initFiles () {
      let fds = await request(`file/post/${this.postId}`, 'POST');
      fds.map(fd => {
        fd.url = `${ ip }${ fd.url }`
        this.initNodeIfExist(fd)
      })
      this.files = fds
    },
    initNodeIfExist (file) {
      let node = document.getElementById(file._id)
      if (node) {
        node.src = file.url
        node.addEventListener('click', e => {
          this.setWidth.target = e.target
        })
      }
    },
    insertImage (file) {
      console.log(file)
      let img = document.getElementById(file._id)
      if (img) img.remove()
      document.execCommand('insertHTML', false, `<img id=${ file._id } src=${ file.url }>`)
      this.initNodeIfExist(file)
    },
    setImgWidth () {
      this.setWidth.target.style.width = `${ this.setWidth.width }px`
      this.setWidth.target = undefined
      this.setWidth.width = 0
    },
    /*
      autoSave
    */
    enableAutoSave () {
      this.autoSaveHandler = setInterval(this.autoSave, 60000);
    },
    disableAutoSave () {
      clearInterval(this.autoSaveHandler)
      console.log('disabled autoSave')
      this.autoSaveHandler = null
    },
    loadSaved () {
      if (localStorage.autoSave == undefined) localStorage.autoSave = "[]";
      let saved = JSON.parse(localStorage.autoSave);
      if (!(saved instanceof Array)) localStorage.autoSave = "[]"
      return saved
    },
    autoSave () {
      this.content = this.$refs.content.innerHTML
      if (this.content.length <= 10) return
      let saved = this.loadSaved()
      saved.unshift({
        time: getNowString({ sec: true }),
        data: this.content
      })
      if (saved.length > 5) saved.pop()
      localStorage.autoSave = JSON.stringify(saved)
      this.saves = saved
    },
    recover (save) {
      const tmp = save.data
      this.autoSave()
      this.content = tmp
    }
  },
  watch: {
    'setWidth.target' () {
      if (this.setWidth.target) {
        this.setWidth.width = this.setWidth.target.clientWidth
      }
    },
    'noteStatus': {
      handler: function () {
        if (this.noteStatus.confirm && this.noteStatus.name == 'deletePost') {
          this.$store.commit('clearNote')
          this.deletePost()
        }
      }, deep: true
    }
  }
}
</script>

<style lang="scss">
.edit {
  $h: .875rem;
  $lh: 1.25rem;
  textarea {
    display: block;
    width: calc(100% - 4rem);
    padding: 1rem 2rem;
  }
  #title {
    height: $lh*1;
  }
  #styling {
    position: sticky;
    top: 0rem;
    background-color: white;
    .btn-group {
      display: inline-block;
      margin-right: 1rem;

      padding: .25rem .5rem;
      border-radius: .25rem;
      background-color: #eee;
    }
    .button {
      margin-right: .5rem;
    }
    #set-width {
      font-size: .75rem;
      input {
        display: inline-block;
        margin: 0 .25rem;
        padding: 0 .25rem;
        width: 2rem;
        border-radius: .25rem;
        background-color: #ddd;
      }
    }
  }
  #content {
    min-height: $lh*10;
    overflow: auto;
    outline: none;
    img {
      display: inline-block;
      resize: both;
      max-width: 100%;
    }
  }
  .actions {
    div {
      margin: 0 1rem;
    }
    padding: .5rem 0;
  }
  .active {
    &::after {
      content: '√'
    }
  }
}
.item {
  cursor: initial;
}
.rbox {
  .item {
    user-select: none;
  }
  #file-uploader {
    display: flex;
    flex-wrap: wrap;
    #input-file {
      display: none;
    }
    #upload {
      margin-left: 1rem;
    }
    #preview {
      margin-top: .5rem;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .thumb-container {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: space-between;
    .thumb {
      margin-bottom: .5rem;
      overflow: hidden;
      width: 5rem;
      user-select: none;
      img {
        width: 100%;
      }
    }
  }
}
</style>