import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const _import = require('./import_'+process.env.NODE_ENV)
const route = [{
  path: '/home',
  name: 'Home',
  component: _import('Home')
}, {
  path: '/',
  redirect: '/home'
}]
const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  routes: route
})
export default router