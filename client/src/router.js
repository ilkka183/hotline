import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import { RestDatabase } from './lib/dataset'

import {
  BrandTable,
  BulletinGroupTable,
  ClientTable,
  ClientGroupTable,
  NoticeTable,
  ProblemTable,
  VehicleTable
} from './lib/tables';

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
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new ProblemTable(database) })
    },
    {
      path: '/problem',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new ProblemTable(database) })
    },
    {
      path: '/notices',
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new NoticeTable(database) })
    },
    {
      path: '/notice',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new NoticeTable(database) })
    },
    {
      path: '/clientgroups',
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new ClientGroupTable(database) })
    },
    {
      path: '/clientgroup',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new ClientGroupTable(database) })
    },
    {
      path: '/clients',
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new ClientTable(database) })
    },
    {
      path: '/client',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new ClientTable(database) })
    },
    {
      path: '/brands',
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new BrandTable(database) })
    },
    {
      path: '/brand',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new BrandTable(database) })
    },
    {
      path: '/vehicles',
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new VehicleTable(database) })
    },
    {
      path: '/vehicle',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new VehicleTable(database) })
    },
    {
      path: '/bulletingroups',
      component: () => import('./views/TableRows.vue'),
      props: () => ({ table: new BulletinGroupTable(database) })
    },
    {
      path: '/bulletingroup',
      component: () => import('./views/TableRow.vue'),
      props: () => ({ table: new BulletinGroupTable(database) })
    },
    {
      path: '/about',
      component: () => import('./views/About.vue')
    }
  ]
})
