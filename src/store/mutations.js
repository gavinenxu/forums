import Vue from 'vue'

export default {
  setItem (state, {item, itemId, resource}) {
    item['.key'] = itemId
    Vue.set(state[resource].items, itemId, item)
  }
}
