import { countObjectProperties } from '@/utils'
import { setResourceMutation, appendChildToParentMutation } from '@/store/assetHelpers'
import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: {}
  },
  getters: {
    threadReplyCount: state => id => countObjectProperties(state.items[id].posts)
  },
  mutations: {
    setThread: setResourceMutation({resources: 'threads'}),
    appendPostToThread: appendChildToParentMutation({parent: 'threads', child: 'posts'}),
    appendContributorToThread: appendChildToParentMutation({parent: 'threads', child: 'contributors'})
  },
  actions: {
    createThread ({state, commit, dispatch, rootState}, {title, text, forumId}) {
      // in order to return threadId to redirect new thread page
      return new Promise((resolve, reject) => {
        const threadId = firebase.database().ref('threads').push().key
        const postId = firebase.database().ref('posts').push().key
        const userId = rootState.auth.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        let thread = {forumId, publishedAt, title, userId, firstPostId: postId, posts: {[postId]: postId}}
        let post = {text, publishedAt, threadId, userId}

        let updates = {
          [`threads/${[threadId]}`]: thread,
          [`forums/${forumId}/threads/${threadId}`]: threadId,
          [`users/${thread.userId}/threads/${threadId}`]: threadId,
          [`posts/${postId}`]: post,
          [`users/${userId}/posts/${postId}`]: postId
        }

        firebase.database().ref().update(updates)
          .then(() => {
            // set thread
            commit('setItem', {itemId: threadId, item: thread, resource: 'threads'}, {root: true})
            commit('forums/appendThreadToForum', {parentId: forumId, childId: threadId}, {root: true})
            commit('users/appendThreadToUser', {parentId: userId, childId: threadId}, {root: true})

            // set child post
            commit('setItem', {itemId: postId, item: post, resource: 'posts'}, {root: true})
            commit('appendPostToThread', {parentId: threadId, childId: postId})
            commit('users/appendPostToUser', {parentId: userId, childId: postId}, {root: true})
            resolve(state.items[threadId])
          })
      })
    },
    editThread ({ state, commit, dispatch, rootState }, {title, text, threadId}) {
      return new Promise((resolve, reject) => {
        // thread
        let thread = {...state.items[threadId], title}
        // post
        const postId = thread.firstPostId
        let post = {...rootState.posts.items[postId], text}
        let edited = { at: Math.floor(Date.now() / 1000), by: rootState.auth.authId }

        let updates = {
          [`threads/${threadId}/title`]: title,
          [`posts/${postId}/text`]: text,
          [`posts/${postId}/edited`]: edited
        }
        firebase.database().ref().update(updates)
          .then(() => {
            commit('setItem', {itemId: threadId, item: thread, resource: 'threads'}, {root: true})
            commit('setItem', {itemId: postId, item: post, resource: 'posts'}, {root: true})
            resolve(state.items[threadId])
          })
      })
    },
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', {resource: 'threads', ids}, {root: true}),
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', {resource: 'threads', id}, {root: true})
  }
}
