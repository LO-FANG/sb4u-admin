import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '主页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  // 合约管理
  {
    path: '/contract',
    component: Layout,
    redirect: '/contract/list',
    name: 'Contract',
    meta: { title: '合约管理' },
    children: [
      {
        path: 'list',
        name: 'ContractList',
        component: () => import('@/views/contract/list'),
        meta: { title: '合约列表' }
      },
      {
        path: 'create',
        name: 'ContractCreate',
        component: () => import('@/views/contract/form'),
        meta: { title: '添加合约' },
        hidden: true
      },
      {
        path: 'edit/:id',
        name: 'ContractEdit',
        component: () => import('@/views/contract/form'),
        meta: { title: '编辑合约' },
        hidden: true
      },
      {
        path: 'detect/:fileId',
        name: 'ContractDetect',
        component: () => import('@/views/contract/detect'),
        meta: { title: '审计合约' },
        hidden: true
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
