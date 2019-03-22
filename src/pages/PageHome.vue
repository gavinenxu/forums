<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to Blog</h1>
    <!-- <ThreadList :threads="threads"/> -->
    <!-- <forum-list :forums="forums"/> -->
    <category-list :categories="categories" :forums="forums"/>
  </div>
</template>

<script>
// import this.$store.state from '@/data.json'
import CategoryList from '@/components/CategoryList'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'PageHome',
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  computed: {
    forums () {
      return Object.values(this.$store.state.forums.items)
    },
    categories () {
      return Object.values(this.$store.state.categories.items)
    }
  },
  beforeCreate () {
    this.$store
      .dispatch('categories/fetchCategories')
      .then(categories => {
        // multi categories to multi forums, use the promise.all()
        return Promise.all(
          categories.map(({ forums }) =>
            this.$store.dispatch('forums/fetchForums', {
              ids: Object.keys(forums)
            })
          )
        )
      })
      .then(() => {
        // this.ready = true
        this.asyncDataStatus_fetched()
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only, 
so the tag will bind with data-v-... -->

<style scoped>
</style>
