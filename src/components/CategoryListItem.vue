<template>
  <div class="forum-list">
    <h2 class="list-title">
      <router-link :to="{name: 'Category', params: {id: category['.key']}}">{{ category.name }}</router-link>
    </h2>

    <forum-list :forums="categoryForums"/>
  </div>
</template>

<script>
  import ForumList from './ForumList'

  export default {
    props: {
      category: {
        type: Object,
        required: true
      },
      forums: {
        type: Array,
        required: true
      }
    },
    components: {
      ForumList
    },
    computed: {
      categoryForums () {
        return Object.values(this.forums)
              .filter(forum => forum.categoryId === this.category['.key'])
      }
    }
  }
</script>

<style scoped>

</style>