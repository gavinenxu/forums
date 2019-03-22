<template>
  <div>
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea 
          name="" 
          id="" 
          cols="30" 
          rows="10"
          ref="postEditorInput"
          v-model="text"
          class="form-input"
        ></textarea>
      </div>
      <div class="form-actions">
        <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
        <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit'}}</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    threadId: {
      type: String,
      required: false
    },
    post: {
      type: Object,
      validator: obj => {
        let keyIsValid = typeof obj['.key'] === 'string'
        let textIsValid = typeof obj.text === 'string'
        let valid = keyIsValid && textIsValid
        if (!keyIsValid) {
          console.error('PostEditor need key')
        }
        if (!textIsValid) {
          console.error('PostEditor need new text')
        }
        return valid
      }
    }
  },
  data () {
    return {
      text: this.post ? this.post.text : ''
    }
  },
  computed: {
    isUpdate () {
      return !!this.post
    }
  },
  methods: {
    ...mapActions('posts', ['createPost', 'updatePost']),
    save (evt) {
      if (!this.$refs.postEditorInput.value.trim()) {
        return
      }
      this.persist()
        .then(post => {
          this.$emit('save', {post})
        })
    },
    cancel () {
      this.$emit('cancel')
    },
    create () {
      let post = {
        text: this.text,
        threadId: this.threadId
      }
      // this.$emit('add-post', post)
      this.text = ''

      return this.createPost(post)
    },
    update () {
      return this.updatePost({postId: this.post['.key'], text: this.text})
    },
    persist () {
      return this.isUpdate ? this.update() : this.create()
    }
  }
}
</script>

<style scoped>

</style>