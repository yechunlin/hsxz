import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import { constantRoutes } from './router/index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log(to.path)
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      console.log(2)
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.username
      if (hasGetUserInfo) {
        console.log(3)
        next()
      } else {
        console.log(4)
        try {
          // get user info
          await store.dispatch('user/getInfo')
          var addRouter = [];
          if(store.getters.userinfo.type == 2){
            addRouter = [{
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
            }];
            //router.addRoutes(addRouter);
            //router.options.routes = constantRoutes.concat(addRouter)  
          }else if(store.getters.userinfo.type == 1){
            addRouter = [
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
              }
            ];
            router.addRoutes(addRouter)
            router.options.routes = constantRoutes.concat(addRouter) 
          }
          //router.options.routes;
          console.log(router.options.routes);
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    console.log(1)
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
