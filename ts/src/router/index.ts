import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

import { BrandTable } from '@/tables/brand';
import { BulletinGroupTable } from '@/tables/bulletin';
import { UserTable, UserGroupTable } from '@/tables/user';
import { NoticeTable } from '@/tables/notice';
import { ProblemTable, ProblemReplyTable } from '@/tables/problem';
import { VehicleTable } from '@/tables/vehicle';
import store from '@/store/index';
import { RestDatabase } from '@/lib/dataset';

Vue.use(Router)

const database: RestDatabase = store.state.database;

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
      component: () => import('@/views/TableRows.vue'),
      props: (route) => ({ table: new ProblemTable(database, store.state.user) })
    },
    {
      path: '/problem',
      name: 'problem',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ProblemTable(database, store.state.user) })
    },
    {
      path: '/problemreply',
      name: 'problemreply',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new ProblemReplyTable(database, store.state.user, undefined) })
    },
    {
      path: '/new-problem',
      name: 'new-problem',
      component: () => import('@/views/NewProblem.vue')
    },
    {
      path: '/open-problem',
      name: 'open-problem',
      component: () => import('@/views/OpenProblem.vue')
    },
    {
      path: '/notices',
      name: 'notices',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new NoticeTable(database, store.state.user) })
    },
    {
      path: '/notice',
      name: '/notice',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new NoticeTable(database, store.state.user) })
    },
    {
      path: '/usergroups',
      name: 'usergroups',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new UserGroupTable(database) })
    },
    {
      path: '/usergroup',
      name: 'usergroup',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new UserGroupTable(database) })
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new UserTable(database) })
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new UserTable(database) })
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new BrandTable(database) })
    },
    {
      path: '/brand',
      name: 'brand',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new BrandTable(database) })
    },
    {
      path: '/vehicle',
      name: 'vehicle',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new VehicleTable(database) })
    },
    {
      path: '/bulletingroups',
      name: 'bulletingroups',
      component: () => import('@/views/TableRows.vue'),
      props: () => ({ table: new BulletinGroupTable(database) })
    },
    {
      path: '/bulletingroup',
      name: 'bulletingroup',
      component: () => import('@/views/TableRow.vue'),
      props: () => ({ table: new BulletinGroupTable(database) })
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/UserAccount.vue')
    }
  ]
});
