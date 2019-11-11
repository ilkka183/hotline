import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import { RestDatabase } from '@/lib/dataset'

import { BrandTable } from '@/tables/brand';
import { BulletinGroupTable } from '@/tables/bulletin';
import { ClientTable, ClientGroupTable } from '@/tables/client';
import { NoticeTable } from '@/tables/notice';
import { ProblemTable } from '@/tables/problem';
import { VehicleTable } from '@/tables/vehicle';

Vue.use(Router)

const database = new RestDatabase('http://localhost:3000', '/api/');

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: { database }
    },
    {
      path: '/problems',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new ProblemTable(database) })
    },
    {
      path: '/problem',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ProblemTable(database) })
    },
    {
      path: '/newproblem',
      component: () => import('@/views/NewProblem.vue'),
      props: { database }
    },
    {
      path: '/openproblem',
      component: () => import('@/views/OpenProblem.vue'),
      props: { database }
    },
    {
      path: '/notices',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new NoticeTable(database) })
    },
    {
      path: '/notice',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new NoticeTable(database) })
    },
    {
      path: '/clientgroups',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new ClientGroupTable(database) })
    },
    {
      path: '/clientgroup',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ClientGroupTable(database) })
    },
    {
      path: '/clients',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new ClientTable(database) })
    },
    {
      path: '/client',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ClientTable(database) })
    },
    {
      path: '/brands',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new BrandTable(database) })
    },
    {
      path: '/brand',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new BrandTable(database) })
    },
    {
      path: '/vehicles',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new VehicleTable(database) })
    },
    {
      path: '/vehicle',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new VehicleTable(database) })
    },
    {
      path: '/bulletingroups',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new BulletinGroupTable(database) })
    },
    {
      path: '/bulletingroup',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new BulletinGroupTable(database) })
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
