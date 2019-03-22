import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Home from '@/pages/PageHome'
import Forum from '@/pages/PageForum'
import ThreadCreate from '@/pages/PageThreadCreate'
import ThreadEdit from '@/pages/PageThreadEdit'
import Category from '@/pages/PageCategory'
import ThreadShow from '@/pages/PageThreadShow'
import PageNotFound from '@/pages/PageNotFound'
import Profile from '@/pages/PageProfile'
import Register from '@/pages/PageRegister'
import SignIn from '@/pages/PageSignIn'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/thread/:forumId/create',
      name: 'ThreadCreate',
      component: ThreadCreate,
      meta: { requireAuth: true },
      props: true
    },
    {
      path: '/thread/:threadId/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      meta: { requireAuth: true },
      props: true
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/register',
      name: 'Register',
      meta: { requireGuest: true },
      component: Register
    },
    {
      path: '/signin',
      name: 'SignIn',
      meta: { requireGuest: true },
      component: SignIn
    },
    {
      path: '/signout',
      name: 'SignOut',
      meta: { requireAuth: true },
      // componentless router
      beforeEnter: (to, from, next) => {
        store.dispatch('signOut')
          .then(() => next({name: 'Home'}))
      }
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      meta: { requireAuth: true }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      meta: { requireAuth: true },
      props: {
        isEdit: true  // set the router default value
      }
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  // router之前需要取到auth user，所以可以用promise发起向后台的请求，得到authuser之后，再来进入router enter的阶段
  store.dispatch('auth/initAuthentication')
    .then(user => {
      // to.matched: match all the nested routes
      if (to.matched.some(record => record.meta.requireAuth)) {
        if (!user) {
          next({name: 'SignIn', query: {redirectTo: to.path}})
        } else {
          next()
        }
      } else if (to.matched.some(record => record.meta.requireGuest)) {
        if (!user) {
          next()
        } else {
          next({name: 'Home'})
        }
      } else {
        next()
      }
    })
})

export default router
