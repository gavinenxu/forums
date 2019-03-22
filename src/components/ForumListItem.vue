<template>
  <div class="forum-listing">
    <div class="forum-details">
      <router-link class="text-xlarge" :to="{name: 'Forum', params: {id: forum['.key']}}">
        {{ forum.name }}
      </router-link>
      <!-- <a href="/forum/-KsjPat5MWCx-dkjNVg8">{{ forum.name }}</a> -->
      <p>{{ forum.description }}</p>
    </div>

    <div class="threads-count">
      <p><span class="count">{{ threadCount }}</span> 
        {{ threadCount === 1 ? 'thread' : 'threads' }}
      </p>
    </div>
  </div>
</template>

<script>
  import { countObjectProperties } from '@/utils'

  export default {
    props: {
      forum: {
        type: Object,
        required: true
      }
    },
    computed: {
      threadCount () {
        return countObjectProperties(this.forum.threads)
      }
    }
  }
</script>

<style scoped>

</style>