import firebase from 'firebase'

export default {
  fetchItem ({ state, commit }, { resource, id }) {
    return new Promise(resolve => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        const item = snapshot.val()
        commit('setItem', {item, itemId: snapshot.key, resource})
        // resolve(item)
        resolve(state[resource].items[id])
      })
    })
  },
  fetchItems ({ dispatch }, { resource, ids }) {
    if (!ids) return Promise.resolve()
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {resource, id})))
  }
}
