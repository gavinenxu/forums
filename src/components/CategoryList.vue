<template>
  <div class="col-full">
    <category-list-item 
      v-for="category in categories"  
      :category="category"
      :forums="forums"
      :key="category['.key']"      
    />
  </div>  
</template>

<script>
  import CategoryListItem from './CategoryListItem'
  export default {
    props: {
      categories: {
        type: Array,
        required: true
      },
      forums: {
        type: Array,
        required: true
      }
    },
    components: {
      CategoryListItem
    }
  }
</script>

<style scoped>

</style>