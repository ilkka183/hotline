import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

import { BrandTable } from '@/tables/brand';
import { BulletinGroupTable } from '@/tables/bulletin';
import { ClientTable, ClientGroupTable } from '@/tables/client';
import { NoticeTable } from '@/tables/notice';
import { ProblemTable } from '@/tables/problem';
import { VehicleTable } from '@/tables/vehicle';
import Connection from '@/js/connection';

Vue.use(Router)

const connection = new Connection();

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: { connection }
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      props: { connection }
    },
    {
      path: '/problems/:type',
      component: () => import('@/views/TableRows.vue'),
      props: (route) => ({ table: new ProblemTable(connection.database, { type: route.params.type }) })
    },
    {
      path: '/problem',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ProblemTable(connection.database) })
    },
    {
      path: '/newproblem',
      component: () => import('@/views/NewProblem.vue'),
      props: { connection }
    },
    {
      path: '/openproblem',
      component: () => import('@/views/OpenProblem.vue'),
      props: { connection }
    },
    {
      path: '/notices',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new NoticeTable(connection.database) })
    },
    {
      path: '/notice',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new NoticeTable(connection.database) })
    },
    {
      path: '/clientgroups',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new ClientGroupTable(connection.database) })
    },
    {
      path: '/clientgroup',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ClientGroupTable(connection.database) })
    },
    {
      path: '/clients',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new ClientTable(connection.database) })
    },
    {
      path: '/client',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ClientTable(connection.database) })
    },
    {
      path: '/brands',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new BrandTable(connection.database) })
    },
    {
      path: '/brand',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new BrandTable(connection.database) })
    },
    {
      path: '/vehicles',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new VehicleTable(connection.database) })
    },
    {
      path: '/vehicle',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new VehicleTable(connection.database) })
    },
    {
      path: '/bulletingroups',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new BulletinGroupTable(connection.database) })
    },
    {
      path: '/bulletingroup',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new BulletinGroupTable(connection.database) })
    },
    {
      path: '/test',
      component: () => import('@/views/Test.vue')
    },
    {
      path: '/about',
      component: () => import('@/views/About.vue')
    }
  ]
});
