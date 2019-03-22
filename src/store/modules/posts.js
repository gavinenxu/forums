import { setResourceMutation } from '@/store/assetHelpers'
import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: {}
  },
  mutations: {
    setPost: setResourceMutation({resources: 'posts'})
  },
  actions: {
    createPost ({ state, commit, rootState }, post) {
      // create postId in database, sync create here
      const postId = firebase.database().ref('posts').push().key
      post.userId = rootState.auth.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      // set own data, and set parent relactionship
      let updates = {
        [`posts/${[postId]}`]: post,
        [`threads/${post.threadId}/posts/${postId}`]: postId,
        [`threads/${post.threadId}/contributors/${post.userId}`]: post.userId,
        [`users/${post.userId}/posts/${postId}`]: postId
      }
      firebase.database().ref().update(updates)
        .then(() => {
          // commit('setPost', {targetId: postId, target: post})
          commit('setItem', {item: post, itemId: postId, resource: 'posts'}, {root: true})
          commit('threads/appendPostToThread', {parentId: post.threadId, childId: postId}, {root: true})
          commit('threads/appendContributorToThread', {parentId: post.threadId, childId: post.userId}, {root: true})
          commit('users/appendPostToUser', {parentId: post.userId, childId: postId}, {root: true})
          // sometime need the postId, so return new create post
          return Promise.resolve(state.items[postId])
        })
    },
    updatePost ({state, commit, rootState}, {postId, text}) {
      return new Promise(resolve => {
        let post = state.items[postId]
        let edited = { at: Math.floor(Date.now() / 1000), by: rootState.auth.authId }
        let updates = {text, edited}

        firebase.database().ref('posts').child(postId).update(updates)
          .then(() => {
            commit('setPost', {targetId: postId, target: {...post, text, edited}})
            resolve(post)
          })
      })
    },
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', {resource: 'posts', ids}, {root: true}),
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', {resource: 'posts', id}, {root: true})
  }
}
