<template>
  <div class="profile-card">

    <p class="text-center">
      <img :src="user.avatar" alt="" class="avatar-xlarge img-update">
    </p>

    <div class="form-group">
      <input v-model="activeUser.username" type="text" value="joker" placeholder="Username" class="form-input text-lead text-bold">
    </div>

    <div class="form-group">
      <input v-model="activeUser.name" type="text" value="Joseph Kerr" placeholder="Full Name" class="form-input text-lead">
    </div>

    <div class="form-group">
      <label for="user_bio">Bio</label>
      <textarea v-model="activeUser.bio" class="form-input" id="user_bio" placeholder="Write a few words about yourself."></textarea>
    </div>

    <div class="stats">
      <span>{{ userPostsCount }} posts</span>
      <span>{{ userThreadsCount }} threads</span>
    </div>

    <hr>

    <div class="form-group">
      <label class="form-label" for="user_website">Website</label>
      <input v-model="activeUser.website" autocomplete="off" class="form-input" id="user_website" value="batman.com">
    </div>

    <div class="form-group">
      <label class="form-label" for="user_email">Email</label>
      <input v-model="activeUser.email" autocomplete="off" class="form-input" id="user_email" value="joker@batmail.com">
    </div>

    <div class="form-group">
      <label class="form-label" for="user_location">Location</label>
      <input v-model="activeUser.location" autocomplete="off" class="form-input" id="user_location" value="You wish!">
    </div>

    <div class="btn-group space-between">
      <button @click.prevent="cancel" class="btn-ghost">Cancel</button>
      <button @click.prevent="save" type="submit" class="btn-blue">Save</button>
    </div>

    <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>
  </div>


</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        activeUser: {...this.user}   // cp by reference, get new obj
      }
    },
    methods: {
      ...mapActions('users', ['editUser']),
      cancel () {
        this.$router.push({name: 'Profile'})
      },
      save () {
        this.editUser({...this.activeUser})
          .then(() => {
            this.$router.push({name: 'Profile'})
          })
      }
    },
    computed: {
      userPostsCount () {
        return this.$store.getters['users/userPostsCount'](this.user['.key'])
      },
      userThreadsCount () {
        return this.$store.getters['users/userThreadsCount'](this.user['.key'])
      }
    }
  }
</script>

<style scoped>

</style>