export {
  countObjectProperties,
  removeEmptyProperties
}

function countObjectProperties (obj) {
  if (typeof obj === 'object') {
    return Object.values(obj).length
  }
  return 0
}

function removeEmptyProperties (obj) {
  var copyObj = {...obj}
  Object.keys(copyObj).forEach(key => {
    if (!copyObj[key]) {
      delete copyObj[key]
    }
  })
  return copyObj
}
