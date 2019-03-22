import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: {}
  },
  actions: {
    fetchCategories ({ state, commit }) {
      return new Promise(resolve => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categories = snapshot.val()
          Object.keys(categories).forEach(categoryId => {
            commit('setItem', {item: categories[categoryId], itemId: categoryId, resource: 'categories'}, { root: true })
          })
          // aliasing, so here categoires already set '.key', but don't return categories directly
          // resolve(categories)
          resolve(Object.values(state.items))
        })
      })
    },
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', {resource: 'categories', id}, { root: true })
  }
}
