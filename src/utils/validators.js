import firebase from 'firebase'
import { helpers } from 'vuelidate/lib/validators'

export {
  uniqueUsername,
  uniqueEmail,
  supportedImageFIle,
  responseOk
}

function uniqueUsername (value) {
  if (!helpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

function uniqueEmail (value) {
  // for async call, it's not required
  if (!helpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

function supportedImageFIle (value) {
  const supported = ['png', 'jpg', 'jpeg', 'gif', 'svg']
  let suffix = value.split('.').pop()
  return supported.includes(suffix)
}

function responseOk (value) {
  if (!helpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    fetch(value)
      .then(response => resolve(response.ok))
      .catch((error) => reject(error))
  })
}
