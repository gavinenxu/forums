import Vue from 'vue'

export {
  appendChildToParentMutation,
  setResourceMutation
}

function appendChildToParentMutation ({parent, child}) {
  return function (state, {parentId, childId}) {
    // let resource = state[parent][parentId]
    // for module pattern, no need for setting parent, cause state is pointing to target state, which is the parent here
    let resource = state.items[parentId]
    if (!resource[child]) { // check if thread have post, not so init the posts
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }
}

function setResourceMutation ({resources}) {
  return function (state, {targetId, target}) {
    // let resource = state[resources]
    let resource = state.items
    Vue.set(resource, targetId, target)
  }
}
