import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_route')
import layout from '@/views/deveops/layout'
import dblayout from '@/views/zdb/layout'
Vue.use(Router)

export const defaultsRouterMap = [
  {
      path: '/login',
      name: 'login',
      component: _import('login/index'),
      hidden: true
  },{
    path: '/404',
    name: '404',
    component: _import('error/404'),
    hidden: true
  },{
    path: '/dashboard',
    name: 'dashboard',
    component: _import('dashboard/manager/index')
  }
]

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: defaultsRouterMap
})


export const devEopsRouterMap = [{
    path: '/authority',
    component: layout,
    meta:{title: '人员管理',icon:'address-card-o',types: 'deveops'},
    children: [{
      path: 'user',
      component: _import('deveops/auth/user'),
      name: 'user',
      meta: { title: '人员',icon:'street-view',hidden:false,cache:true}
    },{
      path: 'auth',
      component: _import('deveops/auth/group'),
      name: 'auth',
      meta: { title: '权限组',icon:'eye-slash',hidden:false,cache:true}
    },{
      path: 'key',
      component: _import('deveops/auth/key'),
      name: 'key',
      meta: { title: '密钥',icon:'key',hidden:false,cache:true}
    },{
      path: 'jumper',
      component: _import('deveops/auth/jumper'),
      name: 'jumper',
      meta: { title: '跳板机',icon:'rocket',hidden:false,cache:true}
    }]
  },{
    path:'',
    component: layout,
    meta: {title:'域名', icon:'codepen', types: 'deveops'},
    children: [{
      path: 'dns',
      component: _import('deveops/dns/index'),
      name: 'dns',
      meta: { title: '域名',icon:'codepen',hidden:true,cache:true}
    }]
  },{
    path: '/manager',
    component: layout,
    meta:{title: '资产管理',icon:'truck',types: 'deveops'},
    children: [{
      path: 'group',
      component: _import('deveops/manager/group'),
      name: 'group',
      meta: { title: '应用组',icon:'server',hidden:false,cache:true}
    },{
      path: 'host',
      component: _import('deveops/manager/host'),
      name: 'host',
      meta: { title: '主机',icon:'laptop',hidden:false,cache:true}
    },{
      path: 'expired',
      component: _import('deveops/expired/host'),
      name: 'expired',  
      meta: { title: 'ECS过期列表',icon:'clock-o',hidden:true,cache:true}
    }]
  },{
    path: '/expired',
    component: layout,
    meta:{title: '过期列表(暂时)',icon:'clock-o',types: 'deveops'},
    children: [{
      path: 'kvstore',
      component: _import('deveops/expired/kvstore'),
      name: 'instance',
      meta: { title: 'KVStore',icon:'database',hidden:false,cache:true}
    },{
      path: 'mongodb',
      component: _import('deveops/expired/mongodb'),
      name: 'role',
      meta: { title: 'MongoDB',icon:'database',hidden:false,cache:true}
    },{
      path: 'rds',
      component: _import('deveops/expired/db'),
      name: 'user',
      meta: { title: 'RDS',icon:'database',hidden:false,cache:true}
    }]
  },{
    path: '/db',
    component: layout,
    meta:{title: 'ZDB',icon:'database',types: 'deveops'},
    children: [{
      path: 'instancegroup',
      component: _import('deveops/zdb/instancegroup'),
      name: 'instancegroup',
      meta: { title: '实例组',icon:'database',hidden:false,cache:true}
    },{
      path: 'instance',
      component: _import('deveops/zdb/instance'),
      name: 'instance',
      meta: { title: '实例',icon:'database',hidden:false,cache:true}
    }]
  },{
    path: '/ops',
    component: layout,
    meta:{title: '运维操作',icon:'newspaper-o',types: 'deveops'},
    children: [{
      path: 'meta',
      component: _import('deveops/ops/meta'),
      name: 'meta',
      meta: { title: 'Meta元操作',icon:'superpowers',hidden:false,cache:true}
    },{
      path: 'mission',
      component: _import('deveops/ops/mission'),
      name: 'mission',
      meta: { title: '任务',icon:'superpowers',hidden:false,cache:true}
    }]
  },{
    path:'',
    component: layout,
    meta:{title: '工单',icon:'newspaper-o',types: 'deveops'},
    children: [{
      path: 'work',
      component: _import('deveops/work/index'),
      name: 'work',
      meta: { title: '工单',icon:'dashboard',hidden:true,cache:true}
    }]
  },{
    path:'/console',
    component: layout,
    meta:{title: '控制台',icon:'terminal',types: 'deveops'},
    children: [{
      path: 'terminal',
      component: _import('deveops/console/terminal'),
      name: '终端',
      meta: { title: '终端',icon:'terminal',hidden:false,cache:true}
    },{
      path: 'enumerate',
      component: _import('deveops/console/enumerate'),
      name: '列举',
      meta: { title: '列举',icon:'terminal',hidden:false,cache:true}
    }]
  },{
    path:'',
    component: layout,
    meta:{title: '装机宝',icon:'steam',types: 'deveops'},
    children: [{
      path: 'ezsetup',
      component: _import('deveops/ezsetup/index'),
      name: 'file',
      meta: { title: '装机宝',icon:'steam',hidden:true,cache:true}
    }]
  },{
    path:'',
    component: layout,
    meta:{title: '分发中心',icon:'file-code-o',types: 'deveops'},
    children: [{
      path: 'file',
      component: _import('deveops/file/index'),
      name: 'file',
      meta: { title: '分发中心',icon:'file-code-o',hidden:true,cache:true}
    }]
  },{
    path:'',
    component: layout,
    meta:{title: '关于',icon:'dashboard',types: 'deveops'},
    children: [{
      path: 'about',
      component: _import('about/index'),
      name: 'about',
      meta: { title: '关于',icon:'dashboard',hidden:true,cache:true}
    }]
  },{
    path:'/zdb',
    component: dblayout,
    meta:{title: 'DBer',icon:'terminal',types:'zdb'},
    children: [{
      path: 'instance',
      component: _import('zdb/db/instance'),
      name: 'DBer',
      meta: { title: 'DBer',icon:'terminal',hidden:false,cache:true}
    },{
      path: 'role',
      component: _import('zdb/db/role'),
      name: 'DBer',
      meta: { title: 'DBer',icon:'terminal',hidden:false,cache:true}
    }]
  }
]
