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

          for(let i in constantRoutes){
            if(hidenRouterArr[store.getters.userinfo.type].indexOf(constantRoutes[i]['path']) > -1 ){
              constantRoutes[i]['hidden'] = true;
            }
          }
          //router.addRoutes(addRouter[store.getters.userinfo.type])
          router.options.routes = constantRoutes
          
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
