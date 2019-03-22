<template>
  <div class="post" v-if="!isdeleted && user && post">
    <div class="user-info">
      <a href="#" class="user-name">{{ user.name }}</a>
      <a href="#">
          <img class="avatar-large" :src="user.avatar" alt="">
      </a>
      <p class="desktop-only text-small">{{ userThreadsCount }} threads</p>
      <p class="desktop-only text-small">{{ userPostsCount }} posts</p>
    </div>
    <div class="post-content">
      <article>
        <template v-if="!isEditing">
          <p>{{ post.text }}</p>
          <a @click.prevent="isEditing = true" href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change"><i class="fa fa-pencil"></i></a>
        </template>
        <post-editor 
          v-else
          :post="post"
          @save="isEditing = false"
          @cancel="isEditing = false"
        />
      </article>
    </div>

    <!-- <div v-if="post.edited" class="edition-info">edited</div> -->
    <!-- <button @click="deletePost">delete</button> -->
    <date-item 
      :timestamp="post.publishedAt"
      class="post-date text-faded"
    />
  </div>
</template>

<script>
  import PostEditor from './PostEditor'

  export default {
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    components: {
      PostEditor
    },
    data () {
      return {
        isEditing: false,
        isdeleted: false
      }
    },
    computed: {
      user () {
        return this.$store.state.users.items[this.post.userId]
      },
      userPostsCount () {
        return this.$store.getters['users/userPostsCount'](this.post.userId)
      },
      userThreadsCount () {
        return this.$store.getters['users/userThreadsCount'](this.post.userId)
      }
      // humanDate () {
      //   return moment.unix(this.post.publishedAt).format('MMMM Do YYYY, h:mm:ss a')
      // }
    },
    methods: {
      deletePost () {
        // trigger dom delete
        this.isdeleted = true
        // fire the action to delete in the database
        // then get the result, make the mutaion for local state
      }
    }
  }
</script>

<style scoped>

</style>