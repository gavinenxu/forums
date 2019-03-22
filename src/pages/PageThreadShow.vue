<template>
  <div>
    <section v-if="asyncDataStatus_ready" class="col-large push-top">
      <h1>{{ thread.title }}</h1>
      <router-link
        :to="{name: 'ThreadEdit', params: {threadId: this.id}}"
        class="btn-green btn-small"
        tag="button"
      >Edit Thread</router-link>
      <p>
        By <a href="#" class="link-unstyled">{{ user.name }}</a>, <date-item :timestamp="thread.publishedAt"/>.
        <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{replyCount}} replies by {{contributorCount}} contributors</span>
      </p>
      <post-list :posts="posts"/>
   
      <post-editor
        v-if="authUser"
        :threadId="id"
      />
      <div v-else class="text-center" style="margin-bottom: 50px;">
        <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign In</router-link> or 
        <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}"> Register</router-link> to post a reply.
      </div>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import PostList from '@/components/PostList'
  import PostEditor from '@/components/PostEditor'
  import { countObjectProperties } from '@/utils'
  import asyncDataStatus from '@/mixins/asyncDataStatus'

  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    },
    mixins: [asyncDataStatus],
    components: {
      PostList,
      PostEditor
    },
    computed: {
      // ...mapGetters('auth', ['authUser']),
      ...mapGetters({
        authUser: 'auth/authUser'
      }),
      posts () {
        const postIds = Object.values(this.thread.posts)
        return Object.values(this.$store.state.posts.items)
          .filter(post => postIds.includes(post['.key']))
      },
      thread () {
        return this.$store.state.threads.items[this.$route.params.id]
      },
      user () {
        return this.$store.state.users.items[this.thread.userId]
      },
      replyCount () {
        return this.$store.getters['threads/threadReplyCount'](this.id) - 1
      },
      contributorCount () {
        // get the unique users diff from first poster
        // const replies = Object.values(this.thread.posts)
        //   .reduce((acc, postId) => {
        //     if (postId !== this.thread.firstPostId) {
        //       acc.push(this.$store.state.posts[postId])
        //     }
        //     return acc
        //   }, [])

        // const userIds = Object.values(replies)
        //   .map(post => post.userId)

        // const uniqueUids = userIds.filter((uid, index) => {
        //   return index === userIds.indexOf(uid)
        // })

        // return uniqueUids.length
        return countObjectProperties(this.thread.contributors)
      }
    },
    methods: {
      // ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts'])
      // ...mapActions('threads', ['fetchThread']),
      ...mapActions({
        fetchThread: 'threads/fetchThread'
      }),
      ...mapActions('users', ['fetchUser']),
      ...mapActions('posts', ['fetchPosts'])
    },
    created () {
      this.fetchThread({id: this.id})
        // .then(thread => {
        //   return this.fetchUser({id: thread.userId})
        //     .then(() => this.fetchPosts({ids: Object.keys(thread.posts)}))
        // })
        .then(thread => {
          this.fetchUser({id: thread.userId})
          return this.fetchPosts({ids: Object.keys(thread.posts)})
        })
        .then(posts => Promise.all(posts.map(post => this.fetchUser({id: post.userId}))))
        .then((pros) => {
          // console.log(pros)
          this.asyncDataStatus_fetched()
        })
    }
  }
</script>