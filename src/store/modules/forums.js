import { appendChildToParentMutation } from '@/store/assetHelpers'

export default {
  namespaced: true,
  state: {
    items: {}
  },
  mutations: {
    appendThreadToForum: appendChildToParentMutation({parent: 'forums', child: 'threads'})
  },
  actions: {
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', {resource: 'forums', ids}, {root: true}),
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', {resource: 'forums', id}, {root: true})
  }
}
