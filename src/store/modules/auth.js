import firebase from 'firebase'
// import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters: {
    // authUser: (state, getters, rootState) => state.authId ? rootState.users.items[state.authId] : null
    authUser (state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null
    }
  },
  mutations: {
    setAuthId (state, userId) {
      state.authId = userId
      // Vue.set(state, 'authId', userId)
    },
    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  },
  actions: {
    registerWithEmailAndPassword ({commit, dispatch}, {email, password, name, username, avatar}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(({ user }) => {
          return dispatch('users/createUser', {id: user.uid, email, name, username, avatar}, {root: true})
        })
        .then(user => {
          commit('setAuthId', user['.key'])
        })
    },
    signInWithEmailAndPassword ({commit}, {email, password}) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    // register or signin both use this method
    signInWithGoogle ({commit, dispatch}) {
      const provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
        .then(data => {
          const user = data.user
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (!snapshot.exists()) {
              return dispatch('users/createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL}, {root: true})
                .then(user => {
                  commit('setAuthId', user['.key'])
                })
                // 第一次创建user的时候, set AuthId mutations
            }
          })
        })
    },
    signOut ({commit}) {
      return firebase.auth().signOut()
        .then(() => {
          commit('setAuthId', null)
        })
    },
    initAuthentication ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        // unsubscribe observer if already listening
        // use the lazy evalutation to avoid the multiple request for every page
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }

        // return the observer function
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('user changed')
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbuser => resolve(dbuser))
          } else {
            resolve(null)
          }
        })
        commit('setUnsubscribeAuthObserver', unsubscribe)
      })
    },
    fetchAuthUser ({ commit, dispatch }) {
      const userId = firebase.auth().currentUser.uid
      // check if it exists in the database, here is callback
      // sometimes we need return null, if it's not in the db, so resolve null
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(userId).once('value', snapshot => {
          if (snapshot.exists()) {
            return dispatch('users/fetchUser', {id: userId}, {root: true})
              .then(user => {
                commit('setAuthId', userId)
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })
      })
    }
  }
}
