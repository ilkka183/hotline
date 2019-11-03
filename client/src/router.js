import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import { RestDatabase } from './lib/dataset'

Vue.use(Router)

const database = new RestDatabase('http://localhost:3000', '/api/');

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/problems',
      name: 'problems',
      component: () => import('./views/Problems.vue'),
      props: { database }
    },
    {
      path: '/notices',
      name: 'notices',
      component: () => import('./views/Notices.vue'),
      props: { database }
    },
    {
      path: '/clientgroups',
      name: 'clientgroups',
      component: () => import('./views/ClientGroups.vue'),
      props: { database }
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('./views/Clients.vue'),
      props: { database }
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('./views/Brands.vue'),
      props: { database }
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('./views/Vehicles.vue'),
      props: { database }
    },
    {
      path: '/bulletingroups',
      name: 'bulletingroups',
      component: () => import('./views/BulletinGroups.vue'),
      props: { database }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    }
  ]
})
