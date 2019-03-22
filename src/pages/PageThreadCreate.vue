<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>

    <thread-editor
      ref="editor" 
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
      forumId: {
        type: String,
        required: true
      }
    },
    mixins: [asyncDataStatus],
    components: {
      ThreadEditor
    },
    data () {
      return {
        saved: false
      }
    },
    computed: {
      forum () {
        return this.$store.state.forums.items[this.forumId]
      },
      needConfirm () {
        return (this.$refs.editor.form.title || this.$refs.editor.form.content) && !this.saved
      }
    },
    methods: {
      ...mapActions('threads', ['createThread']),
      ...mapActions('forums', ['fetchForum']),
      save ({title, text}) {
        if (!title.trim() || !text.trim()) {
          return
        }
        this.createThread({title, text, forumId: this.forum['.key']})
          .then((thread) => {
            this.saved = true
            this.$router.push({name: 'ThreadShow', params: {id: thread['.key']}})
          })
      },
      cancel () {
        this.$router.push({name: 'Forum', params: {id: this.forum['.key']}})
      }
    },
    created () {
      this.fetchForum({id: this.forumId})
        .then(() => {
          this.asyncDataStatus_fetched()
        })
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