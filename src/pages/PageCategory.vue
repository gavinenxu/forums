<template>
  <div v-if="asyncDataStatus_ready" class="category-wrapper">
    <div class="col-full push-top">
        <h1>{{ category.name }}</h1>
    </div>

    <forum-list :forums="forums"/>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import ForumList from '@/components/ForumList'
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
      ForumList
    },
    computed: {
      category () {
        return this.$store.state.categories.items[this.id]
      },
      forums () {
        return Object.values(this.$store.state.forums.items)
                .filter(forum => forum.categoryId === this.id)
      }
    },
    methods: {
      ...mapActions('categories', ['fetchCategory']),
      ...mapActions('forums', ['fetchForums'])
    },
    created () {
      this.fetchCategory({id: this.id})
        .then(category => this.fetchForums({ids: category.forums}))
        .then(() => this.asyncDataStatus_fetched())
    }
  }
</script>

<style scoped>
.category-wrapper {
  width: 100%;
}
</style>