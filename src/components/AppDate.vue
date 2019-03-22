<template>
  <span :title="timestamp | humanUnixDate">{{ timestamp | diffDate }}</span>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    timestamp: {
      type: Number,
      required: true
    }
  },
  filters: {
    humanUnixDate (unixDate) {
      return moment.unix(unixDate).format('MMMM Do YYYY, h:mm:ss a')
    },
    diffDate (unixDate) {
      return moment.unix(unixDate).fromNow()
    }
  }
}
</script>

<style scoped>
</style>