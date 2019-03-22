<template>
  <div class="forum-list">
    <forum-list-item v-for="forum in forums" :forum="forum" :key="forum['.key']"/>
  </div>
</template>

<script>
import ForumListItem from './ForumListItem'
export default {
  props: {
    forums: {
      type: Array,
      required: true
    }
  },
  components: {
    ForumListItem
  }
}
</script>

<style scoped>
</style>