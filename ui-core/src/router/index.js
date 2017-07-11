import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Config from '@/components/Config'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    }
  ]
})
