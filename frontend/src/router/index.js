import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

// import middlewares
import middlewarePipeline from './middlewarePipeline'
import checkAuth from './middleware/checkAuth.js'

// import views components
import Home from '../views/Home.vue'

Vue.use(VueRouter)

// listing routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * AUTHENTICATION
   */
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/Login.vue')
  },
  {
    path: '/reset-auth-api-client',
    name: 'ResetAuthApiCli',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/ResetAuthApiCli.vue')
  },
  {
    path: '/oauth-client-id',
    name: 'AuthorizeClientId',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/AuthorizeClientId.vue')
  },
  {
    path: '/set-api-key',
    name: 'SetApiKey',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/SetApiKey.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * DATA
   */
  {
    path: '/datasets',
    name: 'Datasets',
    component: () => import(/* webpackChunkName: "about" */ '../views/data/Datasets.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/dataset/:id',
    name: 'DatasetUpdate',
    component: () => import(/* webpackChunkName: "about" */ '../views/data/DatasetUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * USERS
   */
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "about" */ '../views/users/Users.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/user/:id',
    name: 'UserUpdate',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "about" */ '../views/users/UserUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * ISSUES
   */
  {
    path: '/issues',
    name: 'Issues',
    component: () => import(/* webpackChunkName: "about" */ '../views/issues/Issues.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/issue/:id',
    name: 'IssueUpdate',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "about" */ '../views/issues/IssueUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * DISCUSSIONS
   */
  {
    path: '/discussions',
    name: 'Discussions',
    component: () => import(/* webpackChunkName: "about" */ '../views/discussions/Discussions.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/discussions/:id',
    name: 'DiscussionUpdate',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "about" */ '../views/discussions/DiscussionUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  }
]

// building routes
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

// adding middleware ability
// cf : https://blog.logrocket.com/vue-middleware-pipelines/
// inspired from : https://github.com/Dotunj/vue-middleware-pipelines/blob/master/src/router/router.js
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]
  const context = {
    to,
    from,
    next,
    router,
    store
  }
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

export default router
