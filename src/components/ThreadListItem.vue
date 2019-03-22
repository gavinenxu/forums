<template>
  <div v-if="user" class="thread">
    <div>
      <p>
        <!-- <a href="/thread/-KsjWehQ--apjDBwSBCY">{{ thread.title }}</a> -->
        <!-- router-link not reload the page, so here we want not see the global variables, like sourceDate -->
        <router-link :to="{name: 'ThreadShow', params: {id: thread['.key']}}">
          {{ thread.title }}
        </router-link>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="#">{{ user.name }}</a>, <date-item :timestamp="thread.publishedAt"/>.
      </p>
    </div>
    <div class="activity">
      <p class="replies-count">
        {{ replyNum }} replies
      </p>
      <!-- <img class="avatar-medium" src="http://i0.kym-cdn.com/photos/images/facebook/000/010/934/46623-batman_pikachu_super.png" alt=""> -->
      <!-- <div>
        <p class="text-xsmall">
          <a href="#">Bruce Wayne</a>
        </p>
        <p class="text-xsmall text-faded">2 hours ago</p>
      </div> -->
    </div>
  </div>
</template>

<script>
// import { countObjectProperties } from '@/utils'
export default {
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    replyNum () {
      return this.$store.getters['users/userThreadsCount'](this.thread.userId)
    },
    user () {
      return this.$store.state.users.items[this.thread.userId]
    }
  }
}
</script>
