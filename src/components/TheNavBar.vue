<template>
  <header class="header" id="header">
    <router-link :to="{name: 'Home'}" class="logo">
      <img src="../assets/img/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': mobileNavOpen}">
      <ul v-if="user">
        <li class="navbar-user" v-close-outside="closeUserDropdown" v-handle-scroll="dosomething">
          <a @click.prevent="dropDownOpen = !dropDownOpen">
            <img class="avatar-small" :src="user.avatar" alt="">
            <span>
              {{ user.name }}
              <img class="icon-profile" src="../assets/img/arrow-profile.svg" alt="">
            </span>
          </a>
          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{'active-drop': dropDownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item" @click="dropDownOpen = !dropDownOpen">
                <router-link :to="{name: 'Profile'}">View profile</router-link>
              </li>
              <li class="dropdown-menu-item"><a @click.prevent="signout">Sign out</a></li>
            </ul>
          </div>
        </li>
      </ul>
          
      <ul v-else>
        <li class="navbar-item">
            <router-link :to="{name: 'SignIn'}">Sign In</router-link>
        </li>
        <li class="navbar-item">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import closeOutside from '@/directives/close-outside'
import handleScroll from '@/directives/handle-scroll'

export default {
  directives: {
    closeOutside,
    handleScroll
  },
  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    })
  },
  data () {
    return {
      dropDownOpen: false,
      mobileNavOpen: false
    }
  },
  methods: {
    signout () {
      this.dropDownOpen = false
      this.$store.dispatch('auth/signOut')
        .then(() => {
          this.$router.push({name: 'Home'})
        })
    },
    closeUserDropdown () {
      this.dropDownOpen = false
    },
    dosomething () {
      // console.log(111)
    }
  }
}
</script>
