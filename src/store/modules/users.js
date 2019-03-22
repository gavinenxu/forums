import { setResourceMutation, appendChildToParentMutation } from '@/store/assetHelpers'
import { removeEmptyProperties, countObjectProperties } from '@/utils'
import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: {}
  },
  getters: {
    userPosts: (state, getters, rootState) => userId => {
      const user = state.items[userId]
      if (user.posts) {
        return Object.values(rootState.posts.items)
          .filter(post => post.userId === userId)
      }
      return []
    },
    userPostsCount: state => id => countObjectProperties(state.items[id].posts),
    userThreadsCount: state => id => countObjectProperties(state.items[id].threads)
  },
  mutations: {
    setUser: setResourceMutation({resources: 'users'}),
    appendPostToUser: appendChildToParentMutation({parent: 'users', child: 'posts'}),
    appendThreadToUser: appendChildToParentMutation({parent: 'users', child: 'threads'})
  },
  actions: {
    createUser ({state, commit}, {id, email, name, username, avatar = null}) {
      return new Promise((resolve, reject) => {
        const registeredAt = Math.floor(Date.now() / 1000)
        const usernameLower = username.toLowerCase()
        email = email.toLowerCase()
        const user = {avatar, email, name, username, usernameLower, registeredAt}
        // const userId = firebase.database().ref('users').push().key
        firebase.database().ref('users').child(id).set(user)
          .then(() => {
            commit('setItem', {itemId: id, item: user, resource: 'users'})
            resolve(state.items[id])
          })
      })
    },
    editUser ({ state, commit }, user) {
      const userId = user['.key']
      let updates = {
        avatar: user.avatar,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        email: user.email,
        location: user.location
      }
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(userId).update(removeEmptyProperties(updates))
          .then(() => {
            commit('setUser', {targetId: userId, target: user})
            resolve(state.items[userId])
          })
      })
    },
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', {resource: 'users', id}, {root: true})
  }
}
