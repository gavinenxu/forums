<template>
  <div class="col-full" :class="$style.centered">
    <h1 :class="$style.headingLarge">Page Not Found!</h1>
    <p :class="$style.textLarge">Why not go to
      <router-link :to="{name: 'Home'}">home page!</router-link>
    </p>
  </div>
</template>

<script>
export default {
  created () {
    this.$emit('ready')
  }
}
</script>


<style module>
.headingLarge {
  font-size: 60px;
}

.textLarge {
  font-size: 30px;
}

.centered {
  text-align: center;
}
</style>