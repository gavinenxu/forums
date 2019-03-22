<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>{{thread.title}}</h1>

    <thread-editor
      ref="editor"
      :title="title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import ThreadEditor from '@/components/ThreadEditor'
  import asyncDataStatus from '@/mixins/asyncDataStatus'
  export default {
    props: {
      threadId: {
        type: String,
        required: true
      }
    },
    mixins: [asyncDataStatus],
    components: {
      ThreadEditor
    },
    computed: {
      thread () {
        return this.$store.state.threads.items[this.threadId]
      },
      title () {
        return this.thread.title
      },
      text () {
        // return this.$store.state.posts[this.thread.firstPostId].text
        // if not fetch thread, so will be undifined, so this time just wait fetch complete
        const post = this.$store.state.posts.items[this.thread.firstPostId]
        return post ? post.text : null
      },
      needConfirm () {
        // this.saved is not required in this implementation because `this.thread.title` and `this.text` are reactive
        // Thus `needConfirm` will automatically become false when the thread is updated
        return this.title !== this.$refs.editor.form.title || this.text !== this.$refs.editor.form.content
      }
    },
    methods: {
      ...mapActions('threads', ['fetchThread', 'editThread']),
      ...mapActions('posts', ['fetchPost']),
      save ({title, text}) {
        if (!title.trim() || !text.trim()) {
          return
        }
        this.editThread({title, text, threadId: this.thread['.key']})
          .then((thread) => {
            this.$router.push({name: 'ThreadShow', params: {id: thread['.key']}})
          })
      },
      cancel () {
        this.$router.push({name: 'ThreadShow', params: {id: this.thread['.key']}})
      }
    },
    created () {
      this.fetchThread({id: this.threadId})
        .then(thread => this.fetchPost({id: thread.firstPostId}))
        .then(() => this.asyncDataStatus_fetched())
    },
    beforeRouteLeave (to, from, next) {
      if (this.needConfirm) {
        let confirmed = window.confirm('Are you sure to leave this page?')
        if (confirmed) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    }
  }
</script>

<style scoped>

</style>