import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      var hidenRouterArr = {
        1 : [],
        2 : ['/cate','/class','/course','/user','/student']
      }
      const hasGetUserInfo = store.getters.username
      if (hasGetUserInfo) {
 
        next()
      } else {
  
        try {
          // get user info
          await store.dispatch('user/getInfo')
          
          var tmpRouterArr = [
            {
              path: '/',
              component: Layout,
              redirect: '/timetable/index'
            },
            {
              path: '/timetable',
              component: Layout,
              hidden: false,
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
              path: '/cate',
              component: Layout,
              hidden: false,
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
              hidden: false,
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
              hidden: false,
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
              path: '/user',
              component: Layout,
              hidden: false,
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
              hidden: false,
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
          ];

          for(let i in tmpRouterArr){
            if(hidenRouterArr[store.getters.userinfo.type].indexOf(tmpRouterArr[i]['path']) > -1 ){
              tmpRouterArr[i]['hidden'] = true;
            }
          }
          //router.addRoutes(addRouter[store.getters.userinfo.type])
          router.options.routes = tmpRouterArr

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {

    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
