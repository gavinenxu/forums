<template>
  <div v-if="asyncDataStatus_ready" class="flex-grid">
    <div class="col-3 push-top">
      <user-profile-card v-if="!isEdit" :user="user"/>
      <user-profile-editor v-else-if="isEdit" :user="user"/>
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{ user.username }}'s recent activity</span>
        <a href="#">See only started threads?</a>
      </div>

      <hr>

      <post-list :posts="userPosts"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileEditor from '@/components/UserProfileEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  props: {
    isEdit: {
      type: Boolean, // conditional rendering by using routers
      default: false
    }
  },
  components: {
    PostList,
    UserProfileCard,
    UserProfileEditor
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    }),
    userPosts () {
      return this.$store.getters['users/userPosts'](this.user['.key'])
    }
  },
  methods: {
    ...mapActions('posts', ['fetchPosts'])
  },
  created () {
    this.fetchPosts({ ids: this.user.posts }).then(() =>
      this.asyncDataStatus_fetched()
    )
  }
}
</script>

<style scoped>
</style>