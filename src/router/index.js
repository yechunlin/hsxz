import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/class/index'
  },
  {
    path: '/class',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'class',
        component: () => import('@/views/class/index'),
        meta: { title: '班级', icon: 'table' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '用户中心', icon: 'user', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
/*export const constantRoutes = [
                {
                  path: '/',
                  component: Layout,
                  redirect: '/class/index'
                },
                {
                path: '/cate',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'cate',
                    component: () => import('@/views/cate/index'),
                    meta: { title: '分类', icon: 'table' }
                  }
                ]
              },
              {
                path: '/class',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'class',
                    component: () => import('@/views/class/index'),
                    meta: { title: '班级', icon: 'table' }
                  }
                ]
              },
              {
                path: '/course',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'course',
                    component: () => import('@/views/course/index'),
                    meta: { title: '课程', icon: 'table' }
                  }
                ]
              },
              {
                path: '/timetable',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'timetable',
                    component: () => import('@/views/timetable/index'),
                    meta: { title: '课程表', icon: 'table' }
                  }
                ]
              },
              {
                path: '/user',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'user',
                    component: () => import('@/views/user/index'),
                    meta: { title: '用户', icon: 'table' }
                  }
                ]
              },
              {
                path: '/student',
                component: Layout,
                children: [
                  {
                    path: 'index',
                    name: 'student',
                    component: () => import('@/views/student/index'),
                    meta: { title: '学生', icon: 'table' }
                  }
                ]
              },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '用户中心', icon: 'user', noCache: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true } 
]*/

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
