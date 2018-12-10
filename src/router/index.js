import Vue from 'vue'
import iView from 'iview'
import Util from '../libs/util'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import { routers, otherRouter } from './router'
import menuUtils from '../libs/menuUtils'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

/**
 * addRoutes
 */
// let routes = JSON.parse(window.sessionStorage.getItem('routes'))
let routes = JSON.parse(window.localStorage.getItem('routes'))
let appRouter = []
if (routes) {
  /**
   * 这里是防止用户手动刷新页面，整个app要重新加载，动态新增的路由，会消失，所以重新add一次
   */
  menuUtils(appRouter, routes)
  router.addRoutes(appRouter)
  routers.push(...appRouter)
  // window.sessionStorage.removeItem('isLoadRoute')
  window.localStorage.removeItem('isLoadRoute')
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking'
    })
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false)
  } else {
    /**
     * addRoutes
     */
    // let routes = JSON.parse(window.sessionStorage.getItem('routes'))
    let routes = JSON.parse(window.localStorage.getItem('routes'))
    if (routes && to.path === '/login') {
      /**
       * 这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，
       * 会再次向router实例里面add路由规则，
       * 而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，
       * 当刷新页面的时候，整个app会重新加载
       * 而我们在刷新之前已经把sessionStorage里的routes移除了，所以上面的添加路由也不执行
       */
      // window.sessionStorage.removeItem('routes')
      // window.sessionStorage.removeItem('isLoadRoute')
      window.localStorage.removeItem('routes')
      window.localStorage.removeItem('isLoadRoute')
      window.location.replace(window.location.href.replace(/^([^#]+)#.+$/, '$1'))
      return false
    }

    if (!routes && !Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
      next({
        name: 'login'
      })
    } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
      Util.title()
      next({
        name: 'home_index'
      })
    } else {
      const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name)
      if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
        if (curRouterObj.access === parseInt(Cookies.get('access'))) {
          Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        } else {
          next({
            replace: true,
            name: 'error-403'
          })
        }
      } else { // 没有配置权限的路由, 直接通过
        Util.toDefaultPage([...routers], to.name, router, next)
      }
    }
  }
})

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
